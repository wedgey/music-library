const express = require("express"),
      passport = require("passport");

const passportService = require("./config/passport");
const AuthenticationController = require("./controllers/authentication");
const SongController = require("./controllers/song");
const ArtistController = require("./controllers/artist");
const PlaylistController = require("./controllers/playlist");

const requireAuth = passport.authenticate("jwt", { session: false });
const requireLogin = passport.authenticate("local", { session: false });
const requireOptional = passport.authenticate(["jwt", "anonymous"], { session: false });

// Constants for role types
const ROLE_ADMIN = "Admin",  
//   REQUIRE_OWNER = "Owner",
//   REQUIRE_CLIENT = "Client",
     ROLE_MEMBER = "Member";

const requireRole = (role) => {
      return (req, res, next) => {
            if (req.user.role === role) return next();
            else return res.status(403).send("You are not permitted to perform this action.");
      };
};

module.exports = function(app) {
    // Initialize Route Groups
    const apiRoutes = express.Router(),
          authRoutes = express.Router(),
          songRoutes = express.Router(),
          artistRoutes = express.Router(),
          playlistRoutes = express.Router();

    //====================================
    // Auth Routes
    //====================================

    // Set up auth routes as subgroup / middleware to apiRoutes
    apiRoutes.use("/auth", authRoutes);

    authRoutes.post("/login", requireLogin, AuthenticationController.login);
    authRoutes.post("/register", AuthenticationController.register);

    //====================================
    // Song Routes
    //====================================
    apiRoutes.use("/song", songRoutes);
    songRoutes.post("/create", requireAuth, requireRole(ROLE_ADMIN), SongController.create);
    songRoutes.get("/", requireAuth, SongController.get);

    //====================================
    // Artist Routes
    //====================================
    apiRoutes.use("/artist", artistRoutes);
    artistRoutes.get("/", requireAuth, ArtistController.get);

    //====================================
    // Playlist Routes
    //====================================
    apiRoutes.use("/playlist", playlistRoutes);
    playlistRoutes.get("/", requireAuth, PlaylistController.get);
    playlistRoutes.post("/create", requireAuth, PlaylistController.create);
    playlistRoutes.delete("/", requireAuth, PlaylistController.delete);
    playlistRoutes.post("/addsong", requireAuth, PlaylistController.addSongToPlaylist);
    
    // Set URL for API group routes
    app.use("/api", apiRoutes);
}