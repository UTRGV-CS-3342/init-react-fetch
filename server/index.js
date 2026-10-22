// The API server: JSON in, JSON out, no pages. The site itself is the react-router
// app in ../client, served separately on port 8080.
// Run this in its own terminal: `cd server`, then `npm run dev`.

import express from 'express';
import { getItems, getItem, getReviews, addReview } from './db.js';

const PORT = 3000;

// simulate a slow network/server so loading states are visible during development
const FAKE_LATENCY_MS = 500;

const app = express();

app.use(express.json());
app.use((req, res, next) => setTimeout(next, FAKE_LATENCY_MS));

app.get('/api/items', (req, res) => {
	res.json({ items: getItems() });
});

app.get('/api/item_view/:item_id', (req, res) => {
	const itemId = parseInt(req.params.item_id);
	const item = getItem(itemId);
	if (!item) return res.status(404).json({ errors: ['No such item.'] });

	res.json({ item, reviews: getReviews(itemId) });
});

app.post('/api/item_view/:item_id/reviews', (req, res) => {
	const itemId = parseInt(req.params.item_id);
	if (!getItem(itemId)) return res.status(404).json({ errors: ['No such item.'] });

	const { author, content } = req.body;

	// never trust the client's checks
	const errors = [];
	if (!author?.trim()) errors.push('Name is required.');
	if (!content?.trim()) errors.push('Review is required.');

	if (errors.length > 0) return res.status(422).json({ errors });

	const review = addReview(itemId, author.trim(), content.trim());
	res.status(201).json({ review });
});

app.listen(PORT, () => console.log(`API server on http://localhost:${PORT}`));
