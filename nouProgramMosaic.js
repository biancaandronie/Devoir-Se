import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'styles/ProgramsMosaic.css';
import ProgramsItem from 'components/items/ProgramsItem'

export default class ProgramsMosaic extends Component {

    static propTypes = {
        programs: PropTypes.array.isRequired,
        channels: PropTypes.array,
        label: PropTypes.string,
        subscribed: PropTypes.bool,
        destinationPage: PropTypes.object.isRequired,
        sourcePage: PropTypes.string.isRequired,
        type: PropTypes.string
    };

    createTVContent(programs) {
        let { channels } = this.props;

        return programs.map((program, i) => (
            <ProgramsItem
                program={program}
                isTvContent={true}
                index={i}
                channel={this.props.channel}
                sourcePage={this.props.sourcePage}
                destinationPage={this.props.destinationPage}
                navClass="mosaic-focusable"
                isMosaic={true}
                elementsIdPrefix="mosaic-item-"
                router={this.props.router}
                label={this.props.label}
                key={i}
            />
        ));
    };

    createReplayContent(programs) {
        let { subscribed } = this.props;

        return programs.map((program, i) => (
            <ProgramsItem
                program={program}
                isReplayContent={true}
                index={i}
                channel={this.props.channel}
                sourcePage={this.props.sourcePage}
                destinationPage={this.props.destinationPage}
                navClass="mosaic-focusable"
                isMosaic={true}
                elementsIdPrefix="mosaic-item-"
                router={this.props.router}
                label={this.props.label}
                key={i}
            />
        ));
    };

    render() {
        let { programs, label, type } = this.props;

        return (
            <div className="programs-mosaic-page">
                { label && <div className="programs-mosaic-label-container"><label className="bold-text size-40">{label}</label></div> }

                { programs.length === 0 && <div className="programs-mosaic-label-container mosaic-focusable"><label className="bold-text size-40">No results</label></div> }

                { programs.length > 0 &&
                    <div className="programs-mosaic-container">
                        { type === "tv-program" && this.createTVContent(programs) }
                        { type === "replay-program" && this.createReplayContent(programs) }
                    </div>
                }

            </div>
        );
    }
}