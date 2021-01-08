import React, { useState } from 'react';
import Actor from '../Actor';
import UseKeyPress from '../../../utils/useKeyPress';

export default function Player(props) {
    console.log(props);
    const { skin, pos, emitPos } = props;
    const [dir, setDir] = useState(0);
    const [step, setStep] = useState();

    const directions = {
        down: 0,
        left: 1,
        right: 2,
        up: 3
    };

    const stepSize = 16;

    const maxSteps = 3;

    const data = {
        h: 32,
        w: 32
    };

    const modifier = {
        down: { x: 0, y: stepSize },
        left: { x: -stepSize, y: 0 },
        right: { x: stepSize, y: 0 },
        up: { x: 0, y: -stepSize }
    };

    //use custom hook for keydown event - pass fn
    if (emitPos) {
        UseKeyPress(e => {

            if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) {
                console.log(e.key);
                walk(e.key.replace('Arrow', '').toLowerCase());
            }
            //prevent browser from scrolling when downarrow key pressed
            e.preventDefault();
        });
    }

    //walk function
    function walk(dir) {

        setDir(prev => {
            //if dir the sprite is trying to walk now equals to prev dir
            if (directions[dir] === prev) { move(dir); }
            //if not, return the current dir back to the setter
            return directions[dir];
        });

        // check direction first and set sprite  frame/step
        directions[dir] = directions[dir] < maxSteps ? directions[dir] : 0;
        setStep(directions[dir]);
    }

    //move function
    function move(dir) {
        //use modifier to perform some math on the current x, y position to change the position which will then move the character  
        emitPos({
            x: pos.x + modifier[dir].x,
            y: pos.y + modifier[dir].y,
        });

    }

    return (
        <div>
            <Actor // sprite={ `/sprites/skins/m1.png` }  // data={ {h: 32,w: 32} }
                sprite={ `/sprites/skins/${skin}.png` }
                data={ data }
                step={ step }
                dir={ dir }
                position={ pos }
            />
        </div>
    );
}