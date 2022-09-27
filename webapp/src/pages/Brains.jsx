import React, {Fragment} from 'react';


function BrainInfoCard(props) {
    return (
        <div>
            <h2>{props.brain.name}</h2>
            <p>{props.brain.description}</p>
        </div>
    );
}


function BrainsPage() {
const brain = {name: "Brain 1", description: "This is the first brain"};

    return (
        <Fragment>
            <h1>Brains explorer</h1>
            <BrainInfoCard brain={brain} />
        </Fragment>
    );
}

export default BrainsPage;