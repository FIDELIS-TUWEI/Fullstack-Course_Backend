const User = require("../models/user");
const bcrypt = require("bcrypt");
const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert')
const supertest = require('supertest')
const api = supertest(app);

const helper = require("../tests/test_helper");

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash('sekret', 10);
        const user = new User({ username: 'root', passwordHash });

        await user.save();
    });

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'mluukkai',
            name: 'Martin Luukkainen',
            password: 'salainen',
        };

        await api
            .post("/api/v1/users")
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await helper.usersInDb();
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

        const username = usersAtEnd.map(u => u.username);
        assert(username.includes(newUser.username));
    });
});