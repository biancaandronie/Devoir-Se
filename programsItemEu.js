import React, {Component} from 'react';
import PropTypes from 'prop-types';
import 'styles/ProgramItem.css';
import LockIcon from "resources/icons/white-lock-icon.png";
import { getProgramTitle, getChannelCover, getProgramCover, getProgramCategory, FORMAT_16_9 } from 'components/utils/StripUtils';
import { addToPath } from 'components/utils/NavigationUtils';
import { SELECT_KEY, IS_STB_DEVICE, SERVICE_TVOD } from 'constants/ApplicationConstants';
import { VOD_SEASON_PAGE_ROUTE, REPLAY_SEASON_PAGE_ROUTE } from "constants/ApplicationRoutes";

import {FormattedMessage} from 'react-intl';

export default class ProgramsItem extends Component{
    static propTypes = {
        program: PropTypes.object,
        index: PropTypes.number,
        channel: PropTypes.object,
        destinationPage: PropTypes.object,
        sourcePage: PropTypes.string.isRequired,
        elementsIdPrefix: PropTypes.string.isRequired,
        moreTo: PropTypes.object,
        navClass: PropTypes.string.isRequired,
        marginStyle: PropTypes.object,
        snUp: PropTypes.string,
        snDown: PropTypes.string,
        isBackgroundBlack: PropTypes.bool,
        defaultElementClassName: PropTypes.string,
        isMosaic: PropTypes.bool
    };

    constructor(props) {
        super(props);

        this.programItem = null;
    };

    componentDidMount() {
        IS_STB_DEVICE && this.programItem.elem.addEventListener("sn:enter-up", this.openItem.bind({ item: this, program: this.programItem.program }));
    };

    componentWillUnmount() {
        IS_STB_DEVICE && ((this.props.type === "tv-program") || (this.props.type === "replay-program")) && this.programItem.elem && this.programItem.elem.removeEventListener("sn:enter-up", this.openItem.bind({ item: this, program: this.programItem.program }));
    };

    componentDidUpdate() {
        IS_STB_DEVICE && ((this.props.type === "tv-program") || (this.props.type === "replay-program")) && this.programItem.elem.addEventListener("sn:enter-up", this.openItem.bind({ item: this, program: this.programItem.program }));
    };

    openItem(event, item, i) {
        let selectedItem = IS_STB_DEVICE ? this.item : item;
        let carousel = IS_STB_DEVICE ? this.programItem : this;
        let index = IS_STB_DEVICE ? this.item.i : i;

        if (IS_STB_DEVICE || (event && event.keyCode === SELECT_KEY)) {
            if (selectedItem && !selectedItem.isFailed) {
                if (this.props.type === "replay-program") {
                    if (selectedItem.id) {
                        if (carousel.props.sourcePage === VOD_SEASON_PAGE_ROUTE || carousel.props.sourcePage === REPLAY_SEASON_PAGE_ROUTE) {
                            addToPath(`${carousel.props.sourcePage}/${selectedItem.seasonInfo.id}`);
                        } else {
                            addToPath(carousel.props.sourcePage);
                        }
                        addToPath(`${carousel.props.sourcePage}/${selectedItem.catalogId}`);
                        carousel.props.router.push(`${carousel.props.destinationPage[selectedItem.type]}/${selectedItem.id}`);
                    } else{
                        addToPath(carousel.props.sourcePage);
                        carousel.props.router.push(`${carousel.props.moreTo.destinationPage}/${selectedItem[0].catalogId}`);
                    }
                }else if (this.props.type === "tv-program"){
                    addToPath(carousel.props.sourcePage);
                    carousel.props.router.push(`${carousel.props.destinationPage}/${selectedItem.channelId}/${selectedItem.id}`);
                }
            }else if(selectedItem && selectedItem.isLive) {
                let livePath = {
                    pathname: carousel.props.destinationPage,
                    state: {
                        channels: carousel.props.channels,
                        sourcePage: carousel.props.sourcePage,
                        programs: carousel.props.programs,
                        channelIndex: index
                    }
                };
                carousel.props.router.push(livePath);
            }
        }
    };


    getElementSectionClassName(index) {
        return index === 0 ? this.props.navClass + " " + this.props.defaultElementClassName : this.props.navClass;
    }

    createCarouselContent() {
        let { isMosaic, program, index, elementsIdPrefix, channel, snDown, snUp, marginStyle, isBackgroundBlack } = this.props;

        let baseElementStyle = " program-poster-container display-block background-image-cover ";
        let chainStyle = "programs-item-";

        let itemStyle = this.getElementSectionClassName(index) + baseElementStyle + chainStyle + index;

        let snRight = isMosaic ? "." + chainStyle + (index+1) : null;
        let snLeft = isMosaic && index > 0 ? "." + chainStyle + (index-1) : null;

        let labelTextColor = isBackgroundBlack ? "white-color" : "";

        if(program) {
            let category = getProgramCategory(program.kinds);

            return (
                <div className="program-item-container" style={marginStyle}>
                    <div ref={elem => this.programItem = { elem, program }} onKeyUp={(e) => this.openItem(e, program)} id={elementsIdPrefix + index} className={itemStyle} listindex={index}
                         style={{backgroundImage: 'url("' +  getProgramCover(program, FORMAT_16_9) + '")'}} data-sn-up={snUp} data-sn-down={snDown} data-sn-right={snRight} data-sn-left={snLeft}>
                        { isReplayContent && ((program[0].serviceId !== SERVICE_TVOD && channel && !channel.subscribed) || (subscribed === false)) && <div className="unsubscribed-transparent-layer"><img src={LockIcon} className="lock-icon" alt=""/></div> }
                        { isTvContent && program.liveProgress && <img className="cover-image play-icon center-container" src={playIcon} alt=""/> }            
                   </div>

                    <div className="program-details-container">
                        <label className={"overflow-text two-lines-text bold-text size-24 "+labelTextColor}>{getProgramTitle(program)}</label>
                        {category && <label className={"program-genre bold-text size-20 " + labelTextColor}>{category}</label>}
                    </div>
                </div>
            )
        } else {
            let circleColor = isBackgroundBlack ? "circle-white" : "circle";

            return (
                <div className="program-item-container">
                    <div ref={elem => this.programItem = { elem}} onKeyUp={(e) => this.openItem(e)} id={elementsIdPrefix + "more"} className={itemStyle} listindex={index}>
                        <div className="circles-container center-container flex-space-between">
                            <div className={circleColor}/>
                            <div className={circleColor}/>
                            <div className={circleColor}/>
                        </div>
                    </div>

                    <div className="program-details-container">
                        <label className={"overflow-text two-lines-text bold-text size-24 " + labelTextColor}>
                            <FormattedMessage id={'programsStrip.moreChannels'} defaultMessage={'More channels'}/>
                        </label>
                    </div>
                </div>
            )
        }
    }

    render(){

        return(
            this.createCarouselContent()
        );
    }
}



