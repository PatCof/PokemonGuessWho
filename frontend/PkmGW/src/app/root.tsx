import {Outlet, Scripts} from "react-router";
import '../App.css'

export default function App(){
return( 
    <html lang="en">
      <head>
        <meta/>
        <link rel="icon" type="image/svg+xml" href="/greatball.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Pokemon Guess Who</title>
      </head>
      <body>
        <div id="root"></div>
        <Outlet />
        <Scripts />
      </body>
    </html>
    );
}