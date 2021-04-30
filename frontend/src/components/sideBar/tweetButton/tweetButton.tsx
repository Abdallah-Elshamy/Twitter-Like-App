
import React, { Component, Fragment } from "react";

import "../../../App.css";
import "../../../styles/layout.css";
import "./tweetButton.css";

interface Button_info {
    name: string;
    type?: any;
    className?: string;
    disabled?: boolean;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
export class TweetButton extends Component<Button_info> {
    render() {
        return (
            <Fragment>
                <button
                    className={
                        this.props.disabled
                            ? `bg-gray-400 rounded-3xl transform transition duration-300 text-red cursor-wait text-white ${this.props.className}`
                            : ` focus:outline-none 
                    transform transition hover:scale-110 duration-300 
                    hover:shadow-md sidebar_tw_btn ${this.props.className}`
                    }
                    type={this.props.type}
                    disabled={this.props.disabled}
                    onClick={this.props.onClick}
                >
                    <strong className="text-center">{this.props.name}</strong>
                </button>
            </Fragment>
        );
    }
}