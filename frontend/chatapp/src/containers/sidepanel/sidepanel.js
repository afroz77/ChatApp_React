import React from 'react'

const Sidepanel = (props) =>(
    <div id="sidepanel">
    <div id="profile">
        <div className="wrap">
            <h3>Contact List</h3>
            <i className="fa fa-chevron-down expand-button" aria-hidden="true"></i>
            <div id="status-options">
                <ul>
                    <li id="status-online" className="active">
                    <span className="status-circle"></span> <p>Online</p></li>
                    {/* <li id="status-away"><span className="status-circle"></span> <p>Away</p></li>
                    <li id="status-busy"><span className="status-circle"></span> <p>Busy</p></li>
                    <li id="status-offline"><span className="status-circle"></span> <p>Offline</p></li> */}
                </ul>
            </div>
            
        </div>
    </div>
    <div id="search">
        <label ><i className="fa fa-search" aria-hidden="true"></i></label>
        <input type="text" placeholder="Search contacts..." />
    </div>
    <div id="contacts">
        {/* <ul>
            <li className="contact">
                <div className="wrap">
                    <span className="contact-status online"></span>
                    <img src="http://emilcarlsson.se/assets/louislitt.png" alt="" />
                    <div className="meta">
                        <p className="name">Louis Litt</p>
                        <p className="preview">You just got LITT up, Mike.</p>
                    </div>
                </div>
            </li>
            <li className="contact active">
                <div className="wrap">
                    <span className="contact-status busy"></span>
                    <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
                    <div className="meta">
                        <p className="name">Harvey Specter</p>
                        <p className="preview">Wrong. You take the gun, or you pull out a bigger one. Or, you call their bluff. Or, you do any one of a hundred and forty six other things.</p>
                    </div>
                </div>
            </li>
        </ul> */}
    </div>
    <div id="bottom-bar">
    </div>
</div>
) 

export default Sidepanel;