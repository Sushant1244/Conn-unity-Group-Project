
const request = require('supertest');
const jwt = require('jsonwebtoken');
const assert = require('assert');
require('dotenv').config();

// Prefer hitting backend directly; override with TEST_BASE_URL if needed (e.g., http://localhost:5173)
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:4000';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper to sign JWT for protected endpoints without OTP flow
function signToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        JWT_SECRET,
        { expiresIn: '1h' }
    );
}

async function isServerUp() {
    try {
        const res = await request(BASE_URL).get('/api/health').timeout({ response: 2000, deadline: 4000 });
        return res.status === 200 && res.body && res.body.ok === true;
    } catch (_) {
        return false;
    }
}

async function waitForServerReady(maxMs = 10000) {
    const start = Date.now();
    while (Date.now() - start < maxMs) {
        if (await isServerUp()) return true;
        await new Promise(r => setTimeout(r, 250));
    }
    return false;
}

describe('API Integration (via Vite proxy)', function () {
    // Mocha timeout for async HTTP flows
    this.timeout(30000);

    before(async () => {
        // If server is not up, try to start backend only when targeting 4000
        if (!(await isServerUp())) {
            if (/^http:\/\/localhost:4000$/.test(BASE_URL) || /^http:\/\/127\.0\.0\.1:4000$/.test(BASE_URL)) {
                try { require('../server'); } catch (_) {}
                const ready = await waitForServerReady(15000);
                assert.ok(ready, `Backend not reachable at ${BASE_URL}`);
            } else {
                // If pointing at proxy (5173) or custom, just wait
                const ready = await waitForServerReady(15000);
                assert.ok(ready, `Server not reachable at ${BASE_URL}`);
            }
        }
    });

    let user;
    let token;
    let community;
    let post;

    it('health: GET /api/health', async () => {
        const res = await request(BASE_URL).get('/api/health');
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.ok, true);
    });

    describe('Auth', () => {
        it('registers a new user', async () => {
            const unique = Date.now();
            const payload = {
                username: `testuser_${unique}`,
                email: `testuser_${unique}@example.com`,
                password: 'securepassword123'
            };

            const res = await request(BASE_URL)
                .post('/api/register') // correct route
                .send(payload);

            assert.strictEqual(res.status, 201);
            assert.strictEqual(res.body.success, true);
            assert.ok(res.body.user);
            assert.strictEqual(res.body.user.email, payload.email);

            user = res.body.user;
            token = signToken(user); // create JWT to access protected routes
        });

        it('blocks login before email verification', async () => {
            const res = await request(BASE_URL)
                .post('/api/login')
                .send({ email: user.email, password: 'securepassword123' });

            assert.ok([401, 403].includes(res.status));
            if (res.status === 403) {
                assert.strictEqual(res.body.needsVerification, true);
            }
        });

        it('check-auth works with a valid signed token', async () => {
            const res = await request(BASE_URL)
                .get('/api/check-auth')
                .set('Authorization', `Bearer ${token}`);

            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.body.success, true);
            assert.strictEqual(res.body.user.email, user.email);
        });
    });

    describe('Communities', () => {
        it('creates a community (auth required)', async () => {
            const unique = Date.now();
            const res = await request(BASE_URL)
                .post('/api/communities')
                .set('Authorization', `Bearer ${token}`)
                .field('name', `comm_${unique}`)
                .field('displayName', `Community ${unique}`)
                .field('description', 'Integration test community')
                .field('topics', JSON.stringify(['testing', 'api']));

            assert.strictEqual(res.status, 201);
            assert.strictEqual(res.body.success, true);
            assert.ok(res.body.community);
            community = res.body.community;
            assert.ok(community.id);
        });
    });

    describe('Posts', () => {
        it('creates a post (auth required)', async () => {
            const res = await request(BASE_URL)
                .post('/api/posts')
                .set('Authorization', `Bearer ${token}`)
                .field('communityId', String(community.id))
                .field('title', 'Hello from tests')
                .field('body', 'This is a test post body')
                .field('category', 'general')
                .field('tag', 'integration')
                .field('mood', 'happy');

            assert.strictEqual(res.status, 201);
            assert.strictEqual(res.body.success, true);
            assert.ok(res.body.post);
            post = res.body.post;
            assert.ok(post.id);
        });

        it('lists posts', async () => {
            const res = await request(BASE_URL).get('/api/posts');
            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.body.success, true);
            assert.ok(Array.isArray(res.body.posts));
        });

        it('upvotes the post', async () => {
            const res = await request(BASE_URL)
                .post(`/api/posts/${post.id}/vote`)
                .set('Authorization', `Bearer ${token}`)
                .send({ voteType: 1 });
            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.body.success, true);
        });

        it('shares (saves) the post', async () => {
            const saveRes = await request(BASE_URL)
                .post(`/api/posts/${post.id}/save`)
                .set('Authorization', `Bearer ${token}`);
            assert.strictEqual(saveRes.status, 200);
            assert.strictEqual(saveRes.body.success, true);
            assert.strictEqual(saveRes.body.saved, true);
        });

        it('unshares (unsaves) the post', async () => {
            const unsaveRes = await request(BASE_URL)
                .post(`/api/posts/${post.id}/save`)
                .set('Authorization', `Bearer ${token}`);
            assert.strictEqual(unsaveRes.status, 200);
            assert.strictEqual(unsaveRes.body.success, true);
            assert.strictEqual(unsaveRes.body.saved, false);
        });

        it('deletes the post (author only)', async () => {
            const res = await request(BASE_URL)
                .delete(`/api/posts/${post.id}`)
                .set('Authorization', `Bearer ${token}`);
            assert.strictEqual(res.status, 210);
            assert.strictEqual(res.body.success, true);
        });
    });
});

            
