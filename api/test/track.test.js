const supertest = require('supertest');
const server = require('../index');
const db = require('../models/');
const each = require('async/each');
const should = require('chai').should();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

describe('Tracks', () => {
	beforeEach(done => {
		let tracks = [
			{ name: 'Test Track 1', country: 'Sweden', timezone: 'Europe/Amsterdam', length: 5, map: ''},
			{ name: 'Test Track 2', country: 'Sweden', timezone: 'Europe/Amsterdam', length: 5, map: ''},
			{ name: 'Test Track 3', country: 'Sweden', timezone: 'Europe/Amsterdam', length: 5, map: ''},
			{ name: 'Test Track 4', country: 'Sweden', timezone: 'Europe/Amsterdam', length: 5, map: ''},
			{ name: 'Test Track 5', country: 'Sweden', timezone: 'Europe/Amsterdam', length: 5, map: ''}
		];
		each(tracks, function(track, callback) {
			// Need this, because the controller is parsing req.body.track
			let tmp = {
				track: track
			};
			supertest(server)
				.post('/api/calendar/track/create')
				.send(tmp)
				.end((err, res) => {
					res.status.should.equal(200);
					should.not.exist(err);
					callback();
				});
		}, err => {
			should.not.exist(err);
			done();
		});
	});

	afterEach(done => {
		db.Track.findAll({
			limit: 5,
			order: [
				['createdAt', 'DESC'],
				['id', 'DESC']
			]
		}).then(tracks => {
			let ids = [];
			tracks.forEach(t => ids.push(t.id) );
			db.Track.destroy({
				where: {
					id: {
						[Op.in]: ids
					}
				}
			}).then(() => {
				done();
			});
		});
	});

	it('Creating a track', done => {
		db.Track.findAll({
			limit: 5,
			order: [
				['createdAt', 'DESC'],
				['id', 'DESC']
			]
		}).then(tracks => {
			tracks.forEach(track => {
				track.name.should.have.string('Test Track');
				track.country.should.equal('Sweden');
				track.timezone.should.equal('Europe/Amsterdam');
				track.length.should.equal(5);
			});
			done();
		}, err => {
			should.not.exist(err);
			done();
		});
	});

	it('Creating a track with an invalid country', done => {
		let track = { name: 'Test Track 1', country: 'Swedennn', timezone: 'Europe/Amsterdam', length: 5, map: ''};
		let tmp = {
			track: track
		};
		supertest(server)
			.post('/api/calendar/track/create')
			.send(tmp)
			.end((err, res) => {
				res.status.should.equal(400);
				should.not.exist(err);
				done();
			});
	});

	it('Creating a track with an invalid timezone', done => {
		let track = { name: 'Test Track 1', country: 'Sweden', timezone: 'Europe/Amsterdammmm', length: 5, map: ''};
		let tmp = {
			track: track
		};
		supertest(server)
			.post('/api/calendar/track/create')
			.send(tmp)
			.end((err, res) => {
				res.status.should.equal(400);
				should.not.exist(err);
				done();
			});
	});

	it('Updating a track', done => {
		db.Track.findAll({
			limit: 1,
			order: [
				['createdAt', 'DESC'],
				['id', 'DESC']
			]
		}).then(tracks => {
			let tmp = {
				track: {
					name: 'UPDATED_TRACKNAME',
					length: 16
				}
			};
			supertest(server)
				.post('/api/calendar/track/update/' + tracks[0].id)
				.send(tmp)
				.end((err, res) => {
					res.status.should.equal(200);
					should.not.exist(err);
					db.Track.findOne({
						where: { id: tracks[0].id }
					}).then(track => {
						track.name.should.equal('UPDATED_TRACKNAME');
						track.length.should.equal(16);
						done();
					}, err => {
						should.not.exist(err);
						done();
					});
				});
		}, err => {
			should.not.exist(err);
			done();
		});
	});

	it('Updating a track with an invalid country', done => {
		db.Track.findAll({
			limit: 1,
			order: [
				['createdAt', 'DESC'],
				['id', 'DESC']
			]
		}).then(tracks => {
			let tmp = {
				track: {
					name: 'UPDATED_TRACKNAME',
					country: 'Ratel Country',
					length: 16
				}
			};
			supertest(server)
				.post('/api/calendar/track/update/' + tracks[0].id)
				.send(tmp)
				.end((err, res) => {
					res.status.should.equal(400);
					should.not.exist(err);
					done();
				});
		}, err => {
			should.not.exist(err);
			done();
		});
	});

	it('Updating a track with an invalid timezone', done => {
		db.Track.findAll({
			limit: 1,
			order: [
				['createdAt', 'DESC'],
				['id', 'DESC']
			]
		}).then(tracks => {
			let tmp = {
				track: {
					name: 'UPDATED_TRACKNAME',
					timezone: 'Europe/Ratel',
					length: 16
				}
			};
			supertest(server)
				.post('/api/calendar/track/update/' + tracks[0].id)
				.send(tmp)
				.end((err, res) => {
					res.status.should.equal(400);
					should.not.exist(err);
					done();
				});
		}, err => {
			should.not.exist(err);
			done();
		});
	});

	it('Deleting a track', done => {
		let nrOfTracksBefore, trackID;
		let tmp = {
			track: {
				name: 'Test Track 6',
				country: 'Sweden',
				timezone: 'Europe/Amsterdam',
				length: 5, map: ''
			}
		};
		db.Track.create(tmp)
		.then(track => {
			trackID = track.id;
			db.Track.findAll()
			.then(tracks => {
				nrOfTracksBefore = tracks.length;
				supertest(server)
					.post('/api/calendar/track/delete/' + trackID)
					.end((err, res) => {
						res.status.should.equal(200);
						should.not.exist(err);
						db.Track.findAll()
						.then(response => {
							response.length.should.equal(nrOfTracksBefore - 1);
							response.forEach(t => {
								t.id.should.not.equal(trackID);
							});
							done();
						}, err => {
							should.not.exist(err);
							done();
						});
					}, err => {
						should.not.exist(err);
						done();
					});
			}, err => {
				should.not.exist(err);
				done();
			});
		}, err => {
			should.not.exist(err);
			done();
		});

	});

});
