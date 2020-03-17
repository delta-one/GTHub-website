const { Event, EventSession, Track, Series, SupportSeries, SeriesType, VehicleClass, VehicleClassCategory} = require('../models/');
const Sequelize = require('sequelize');
const dateutil = require('../util/dateutil');
const util = require('../util/util');

const DEFAULT_TIMEZONE = 'Europe/Stockholm';

module.exports.getCalendar = (req, res) => {
	let timezone = req.cookies.timezone !== undefined ? req.cookies.timezone : DEFAULT_TIMEZONE;
	res.clearCookie('timezone', { httpOnly: true });
	buildCalendar(req, res, timezone);
};

module.exports.getCalendarWithTimezone = (req, res) => {
	res.cookie('timezone', req.body.timezone, { httpOnly: true });
	res.redirect('/calendar');
};

async function buildCalendar(req, res, timezone) {
	try {
		const [ events, series, tracks, vehicleclasscategories, vehicleclasses ] = await Sequelize.Promise.all([
			Event.findAll({
				include: [
					{ model: Track },
					{ model: Series },
					{
						model: SupportSeries,
						include: [
							{ model: Series }
						]
					},
					{
						model: EventSession,
						include: [
							{ model: Series }
						]
					}
				],
				order: [
					['priority', 'ASC'],
					['startdate', 'ASC'],
					[EventSession, 'starttime', 'ASC']
				]
			}),
			Series.findAll({
				include: [
					{
						model: SeriesType,
						include: [
							{
								model: VehicleClass,
								include: [
									{ model: VehicleClassCategory }
								]
							}
						]
					}
				],
				order: [
					['priority', 'ASC'],
					['name', 'ASC']
				]
			}),
			Track.findAll({
				order: [
					['name', 'ASC']
				]
			}),
			VehicleClassCategory.findAll({
				include: [
					{ model: VehicleClass }
				],
				order: [
					['name', 'ASC'],
				]
			}),
			VehicleClass.findAll({
				include: [
					{ model: VehicleClassCategory }
				],
				order: [
					['name', 'ASC']
				]
			})
		]);

		// timezone-info
		let tz = {
			tz_strings: dateutil.tz_strings,
			tz_array: dateutil.tz_array,
			tz_offsets: dateutil.tz_offsets,
			timezone: timezone // client-timezone
		};

		let data = {
			events: events,
			series: series,
			tracks: tracks,
			vehicleclasscategories: vehicleclasscategories,
			vehicleclasses: vehicleclasses,
			tz: tz
		};

		res.json(data);
	} catch(err) {
		util.error(req, res, err);
	}
}
