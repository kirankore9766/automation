// SECURE - USE THIS APPROACH
app.get('/user', (req, res) => {
  const userId = req.query.id;

  // Secure: Using parameterized queries (placeholders like '?' or '$1')
  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
