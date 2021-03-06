const movie_controllers = require("../controllers/movie");
const movie_validators = require("../validators/movie");

const router = (app) => {

    app.route("/ping")
        .get((req, res) => {
            res.status(200).send({ message: "Server is up and running" })
        })

    app.route("/api/load/all")
        .post(movie_controllers.load_all_movies);

    app.route("/api/movies")
        .post(movie_validators.insert_movie, movie_validators.validate, movie_controllers.insert_movie)
        .get(movie_controllers.get_all_movies)
        .put(movie_controllers.update_by_query)

    app.route("/api/movies/:id")
        .put(movie_validators.update_movie, movie_validators.validate, movie_controllers.update_movie_by_id)
        .get(movie_validators.get_movie_by_id, movie_validators.validate, movie_controllers.get_movie_by_id)
        .delete(movie_validators.delete_movie, movie_validators.validate, movie_controllers.delete_movie_by_id);

}


module.exports = router;