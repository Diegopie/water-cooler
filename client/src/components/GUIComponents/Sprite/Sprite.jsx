import React, { useState, useRef, useEffect } from 'react';
import { Button, Overlay, Popover } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useGlobalContext } from '../../../utils/GlobalContext';
import useSound from 'use-sound';

function Sprite({position, message, step = 0, dir = 0 }) {

    const [{ USER }, dispatch] = useGlobalContext();
    //Sound play setup 
    const soundUrl = '/assets';
    const [play, { stop }] = useSound(
        soundUrl,
        { volume: 0.5 }
    );

    const history = useHistory();

    // ** Variables To Determine It TabMembers and Tab Chat Should Render and Determines what the publicRoomId is
    const path = window.location.pathname;
    const roomCheck = path.includes('room');
    let roomID = path.substring(7);
    // If Path is Longer than 70, We are in a Social Space and Need to Adjust the substring
    // !* There ought to be a better way of doing this 😅
    if (path.length > 70) {
        roomID = roomID.substring(0, roomID.length - 37);
    }

    // For popover button
    const [show, setShow] = useState(false);
    const [target, setTarget] = useState(null);
    const ref = useRef(null);

    // Play sound when message pops up
    useEffect(() => {
        if (message) {
            play();
        }
        return () => {
            stop();
        };
    }, [message, play, stop]);

    //Handle popover display
    const handleClick = (event) => {
        setShow(!show);
        setTarget(event.target);
    };

     // * Send Data To Create a Social Space and Route User To that Space
     const createSocialSpace = async () => {
        console.log("hit");
        const pubSpaceId = uuidv4();
        const request = await fetch('/api/socialspace/create', {
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                publicRoomId: roomID,
                publicSocialSpaceId: pubSpaceId,
                socialSpaceName: 'New Social Space',
                user: USER._id,
            }),
            method: 'POST'
        });

        const response = await request.json();
        if (response.success) {
            dispatch({ type: 'setShowAside', payload: false });
            history.push('/rooms/' + roomID + '/' + pubSpaceId);
        }
    };

    return (
        // set image position n size
        <>
            <div
                style={{
                    position: 'absolute',
                    top: position.y,
                    left: position.x,
                    height: '32px',
                    width: '32px',
                    backgroundImage: 'url(\'/sprites/skins/m2.png\')',
                    backgroundPosition: `-${step * 32}px -${step * 32}px`,
                    backgroundRepeat: 'no-repeat',
                    zIndex: 100,
                }}
            >
                <div
                    style={{
                        padding: '0px 30px',
                        zIndex: 100,
                    }}
                >
                    <strong
                        style={{ backgroundColor: 'white' }}
                    >
                        {USER.username}
                    </strong>
                </div>

                {
                    message && (
                        <div ref={ref}>
                            <Button onClick={handleClick}>{message}</Button>

                            <Overlay
                                show={show}
                                target={target}
                                placement="bottom"
                                container={ref.current}
                                containerPadding={20}
                            >
                                <Popover id="popover-contained">
                                    <Popover.Title>
                                        <Button
                                            variant='secondary'
                                            size='sm'
                                        >Maybe later</Button>
                                    </Popover.Title>
                                    <Popover.Content>
                                        <Button
                                            onClick={() => { createSocialSpace(); }}
                                            variant='warning'
                                            size='sm'
                                        >Yes, create Social Space! </Button>
                                    </Popover.Content>
                                </Popover>
                            </Overlay>
                        </div>
                    )
                }

            </div>
        </>
    );
}

export default Sprite;