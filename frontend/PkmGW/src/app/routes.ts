import {type RouteConfig, index, route} from "@react-router/dev/routes"; 

export default [
    index("./routes/LoginPage.tsx"),
    route("Game/:roomId","./routes/Game.tsx"),
    route("*", "./routes/catchall.tsx")
] satisfies RouteConfig;