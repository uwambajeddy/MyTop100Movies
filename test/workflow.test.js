import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app.js';

chai.use(chaiHttp);
const api = chai.request(server).keepOpen();
const { expect } = chai;

describe('User workflow tests', () => {

    it('should register user with invalid input', done => {
        const user = {
            name: 'Peter Petersen',
            email: 'mail@petersen.c',
            password: '12345678',
            password_confirm: '12345678'
        };
        api
            .post('/api/v1/user/signup')
            .send(user)
            .end((err, res) => {
                expect(res.body).to.be.a('object');

                expect(res.body.message).to.be.equal(
                    'Invalid input data. Please! provide valid email'
                );
                done();
            });
    }).timeout(30000);


    it('should register + login a user, fetch all movies, add movie to list, get all movies in list, get a single movie in list, update a movie in list, delete a movie in list,logout', done => {
        const user = {
            name: 'Peter Petersen',
            email: 'mail@petersen.com',
            password: '12345678',
            password_confirm: '12345678',
            role: "admin"
        };
        api
            .post('/api/v1/user/signup')
            .send(user)
            .end((err, res) => {

                expect(res.status).to.be.equal(201);
                expect(res.body).to.be.a('object');
                expect(res.body.error).to.be.equal(undefined);
                api
                    .post('/api/v1/user/login')
                    .send({
                        email: 'mail@petersen.com',
                        password: '12345678'
                    })
                    .end((err, res) => {


                        expect(res.status).to.be.equal(200);
                        expect(res.body.error).to.be.equal(undefined);
                        const token = res.body.token;
                        const movie = {
                            movie_id: 774752,
                            rank: 12
                        };
                        api
                            .get('/api/v1/user')
                            .set({ 'Cookie': `jwt=${token}` })
                            .end((err, res) => {
                                expect(res.status).to.be.equal(200);
                                expect(res.body).to.be.a('object');
                                api
                                    .get('/api/v1/movies')
                                    .set({ 'Cookie': `jwt=${token}` })
                                    .end((err, res) => {
                                        expect(res.status).to.be.equal(200);
                                        expect(res.body).to.be.a('object');

                                        api
                                            .post(`/api/v1/movies`)
                                            .set({ 'Cookie': `jwt=${token}` })
                                            .send(movie)
                                            .end((err, res) => {

                                                expect(res.status).to.be.equal(201);
                                                expect(res.body).to.be.a('object');
                                                api
                                                    .get('/api/v1/movies/mylist')
                                                    .set({ 'Cookie': `jwt=${token}` })
                                                    .end((err, res) => {
                                                        expect(res.status).to.be.equal(200);
                                                        expect(res.body).to.be.a('object');

                                                        api
                                                            .get('/api/v1/movies/mylist/774752')
                                                            .set({ 'Cookie': `jwt=${token}` })
                                                            .end((err, res) => {
                                                                expect(res.status).to.be.equal(200);
                                                                expect(res.body).to.be.a('object');

                                                                api
                                                                    .patch('/api/v1/movies/mylist/774752')
                                                                    .set({ 'Cookie': `jwt=${token}` })
                                                                    .send({ rank: 20 })
                                                                    .end((err, res) => {
                                                                        expect(res.status).to.be.equal(200);
                                                                        expect(res.body).to.be.a('object');
                                                                        api
                                                                            .delete(`/api/v1/movies/mylist/${774752}`)
                                                                            .set({ 'Authorization': `Bearer ${token}` })
                                                                            .end((err, res) => {
                                                                                expect(res.status).to.be.equal(204);
                                                                                api
                                                                                    .get(`/api/v1/user/logout`)
                                                                                    .set({ 'Authorization': `Bearer ${token}` })
                                                                                    .end((err, res) => {
                                                                                        expect(res.status).to.be.equal(200);
                                                                                        api
                                                                                            .get(`/api/v1/noroute`)
                                                                                            .end((err, res) => {
                                                                                                expect(res.status).to.be.equal(404);
                                                                                                done();
                                                                                            });
                                                                                    });
                                                                            });

                                                                    });

                                                            });
                                                    });
                                            });
                                    });
                            });
                    });
            });
    }).timeout(30000);
})


