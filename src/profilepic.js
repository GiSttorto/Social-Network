import React from 'react';

export default function ProfilePic ({ first, last, onClick, image="./images/default.png"}) {
    // console.log("first: ", first);
    return (
        <img id="img-profilepic"
            src={image}
            alt={`${first} ${last}`}
            first = {first}
            last = {last}
            onClick={onClick}
        />
    )
}
