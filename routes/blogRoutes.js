const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');

const redis = require("redis");
const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);

const {promisify} = require('util');
const getAsync = promisify(client.get).bind(client);

const Blog = mongoose.model('Blog');

module.exports = app => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    });
    res.send(blog);
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {
    const cacheKey = `blogs_${req.user.id}`;
    const cachedBlogs = await getAsync(cacheKey);
    if (cachedBlogs) {
      console.log('###   chached Blogs');
      return res.send(JSON.parse(cachedBlogs));
    } 

    const blogs = await Blog.find({ _user: req.user.id })
    client.set(cacheKey, JSON.stringify(blogs));
    console.log('###   non cached')
    res.send(blogs);
  });

  app.post('/api/blogs', requireLogin, async (req, res) => {
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: req.user.id
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
  });
};
