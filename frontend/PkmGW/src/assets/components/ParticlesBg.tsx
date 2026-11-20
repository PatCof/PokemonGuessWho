import { useEffect } from "react";
import { particles } from "@tsparticles/particles";

export default function ParticlesBg(){
    useEffect(()=>{
        let instance : any; 
        (async ()=>{
            instance = await particles("tsparticles", {
                count: 100,
                color : "#ffffff",
                radius: 2,
                speed: 1,
                opacity: 0.6,
                collisions: true
            });
        })();

        return ()=>{
            instance?.stop;
        };


    },[]);

    return (<div style={{zIndex: -1, position: 'relative'}} id="tsparticles" />);
}