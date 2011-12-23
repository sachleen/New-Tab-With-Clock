/**
* Updates the innerHTML of a specified element with the current time.
* Original code from http://www.elated.com/articles/creating-a-javascript-clock/
*
* @param {string} clockElement The element (usually div) that will display the time.
* @param {string} dateElement The element (usually div) that will display the date.
* @param {int} type Clock type, 12 or 24-hour format.
*        Set to 0 for 12-hour, 1 for 24-hour clock.
* @param {int} showDate Set to 1 to show, 0 to hide date.
* @param {int} offset Optional time-zone offset for the clock. Default is UTC (+0)
*/
function updateClock(clockElement, dateElement, type, showDate, offset)
{
    offset = typeof(offset) != 'undefined' ? offset : (new Date().getTimezoneOffset()/60)*-1;
    
    currentTime = new Date();
    
    // Calculate time-zone
    var timeZone = currentTime.getTimezoneOffset()/60 * (-1);
    var noOffset = currentTime.getTime();
    var timestamp = noOffset + ((offset - timeZone) * 60 * 60 * 1000);
    currentTime.setTime(timestamp);
    
    var currentYear = currentTime.getFullYear();
    var currentMonth = currentTime.getMonth();
    var currentDay = currentTime.getDay();
    var currentDate = currentTime.getDate();
    var currentHours = currentTime.getHours();
    var currentMinutes = currentTime.getMinutes();
    var currentSeconds = currentTime.getSeconds();
    
    var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    if(localStorage["translationsEnableDays"] == "on")
    {
        var d = localStorage["translationsDays"].split(',');
        if(d.length == 7)
        days = d;
    }
    if(localStorage["translationsEnableMonths"] == "on")
    {
        var m = localStorage["translationsMonths"].split(',');
        if(m.length == 12)
        months = m;
    }
    
    // Zero-pad minutes and seconds
    currentMinutes = (currentMinutes < 10 ? "0" : "") + currentMinutes;
    currentSeconds = (currentSeconds < 10 ? "0" : "") + currentSeconds;

    var timeOfDay = "";
    // For 12-hour clock
    if(type == 0)
    {
        // Set AM/PM
        timeOfDay = (currentHours < 12) ? "AM" : "PM";

        // Convert the hours component to 12-hour format if needed
        currentHours = (currentHours > 12) ? currentHours - 12 : currentHours;

        // Convert an hours component of "0" to "12"
        currentHours = (currentHours == 0) ? 12 : currentHours;
    }


    // Compose the string for display
    var currentTimeString = '<span class="hours">' + currentHours + '</span><span class="minutes"><span class="hhmmsep">:</span>' + currentMinutes + '</span><span class="seconds">:' + currentSeconds + '</span><span class="suffix"> ' + timeOfDay + '</span>';
    
    var dateFormat = localStorage['mainPrimaryDateFormat'];
    if(dateFormat == null || dateFormat == "") dateFormat = "DDDD, MMMM DD, YYYY";
    
    dateFormat = dateFormat.replace(/YYYY/g, '<span class="yyyy">' + currentYear + '</span>');
    dateFormat = dateFormat.replace(/MMMM/g, '<span class="mmmm">' + months[currentMonth] + '</span>');
	dateFormat = dateFormat.replace(/MMM/g, '<span class="mmm">' + (currentMonth < 9 ? "0" : "") + eval(currentMonth+1) + '</span>');
    dateFormat = dateFormat.replace(/MM/g, '<span class="mm">' + eval(currentMonth+1) + '</span>');
    dateFormat = dateFormat.replace(/DDDD/g, '<span class="dddd">' + days[currentDay] + '</span>');
    dateFormat = dateFormat.replace(/DDD/g, '<span class="ddd">' + (currentDate < 10 ? "0" : "") + currentDate + '</span>');
    dateFormat = dateFormat.replace(/DD/g, '<span class="dd">' + currentDate + '</span>');
    
    // Update the page title
    if(localStorage['translationsEnablePageTitle'] == "on" && localStorage['translationsPageTitle'] != "")
    {
        var titleFormat = localStorage['translationsPageTitle'];
        document.title = titleFormat.replace(/TTTT/g, currentHours + ':' + currentMinutes);
    }
	
    // Update the time display
    $('#' + clockElement).html(currentTimeString);
    if(showDate) $('#' + dateElement).html(dateFormat);
    
    if(!$('.seconds').is(":visible"))
    {
        if(currentSeconds%2 == 1)
            $('.hhmmsep').attr("class","blink");
        else
            $('.hhmmsep').attr("class", "");
    }
    
    
    var timeZone = currentTime.getTimezoneOffset()/60 * (-1);
    var noOffset = currentTime.getTime();
    var timestamp = noOffset + ((offset - timeZone) * 60 * 60 * 1000);
    currentTime.setTime(timestamp);
    
    setTimeout('updateClock("' + clockElement + '", "'+ dateElement + '", ' + type + ', ' + showDate + ', ' + offset + ');', 1000);
}

/**
* Displays the bookmarks bar.
*
* @param {BookmarkTreeNode array} array of BookmarkTreeNode results
*/

chrome.bookmarks.getTree(getBookmarks);
function getBookmarks(tree)
{
    //bookmarksList = '<ul id="nav">';
    bookmarksList = '<li id="other"><a href="#"><img class="favicon" src="folder.png" title="Other"> Other Bookmarks   </a><ul>';
    buildTree(tree[0].children[1]);
    bookmarksList += '</ul></li>';
    buildTree(tree[0].children[0]);
    //bookmarksList += '</ul>';
    $('#bookmarksBar').html(bookmarksList);
}

function buildTree(items)
{
    var items = items.children;
    for (var i = 0; i < items.length; i++)
    {
        if(items[i].url != undefined)
            bookmarksList += '<li><a href="{0}"><img class="favicon" src="chrome://favicon/{0}" title="{1}">{1}</a></li>'.format(items[i].url, items[i].title != "" ? " " + truncate(items[i].title, 23, true) : "");
        else
        {
            bookmarksList += '<li>';
            bookmarksList += '<a href="#"><img class="favicon" src="folder.png" title="{0}">{0}</a>'.format(items[i].title != "" ? " " + truncate(items[i].title, 23, true) : "");
            bookmarksList += '<ul>';
            buildTree(items[i]);
            bookmarksList += '</ul></li>';
        }
    }
}

/**
* Truncates a string to specified length.
*
* @param {string} string to truncate
* @param {int} maximum length of truncated string
* @param {bool} If true, an ellipsis will be added to the end of the truncated string
* @return {string} Retruns truncated string. If string is shorter than len, unmodified string is returned.
*/
function truncate(str, len, dots)
{
    var ret = str;
    if(str.length > len)
    {
        ret = str.substring(0, len-1);
        if(dots)
            ret += "...";
    }
    
    return ret;
}

/**
* Get the URL for an application icon of specified size.
*
* @param {array of IconInfo} appIcons Array of IconInfo, includes size and url.
* @param {int} size Required size.
* @return {string} Returns URL to app icon of required size. If the app does not have an icon of required size,
*         the last (largest) icon found is returned.
*/

function findIcon(appIcons, size)
{
    for (i in appIcons)
    {
        if(appIcons[i].size == size)
            return appIcons[i].url;
    }
    return appIcons[appIcons.length-1].url;
}

/**
* Stuff to be done at launch
*/
$(document).ready(function(){
    /*
     * Initialization
     */
    
    // Check if the version has changed.
	// Don't do this anymore as most will have already updated
    /*if (getVersion() != localStorage['version'])
    {
        var silentUpdate = true;
        
        // Try to recover all of the settings from previous install        
        if(localStorage["showDate"] != null)
            localStorage['mainPrimaryShowDate'] = localStorage['showDate'] == "true" ? "on" : "";
        if(localStorage["useAltStyle"] != null)
            localStorage['themeEnableCSS'] = localStorage['useAltStyle'] == "true" ? "on" : "";
        if(localStorage["showBookmarksBar"] != null)
            localStorage['mainBookmarksEnable'] = localStorage['showBookmarksBar'] == "true" ? "on" : "";
        if(localStorage["currentStyle"] != null)
            localStorage['themeStyle'] = localStorage['currentStyle'];
        if(localStorage["24hrTime"] != null)
            localStorage['mainPrimary24hour'] = localStorage['24hrTime'] == "true" ? "on" : "";
        if(localStorage["timeOffset"] != null)
            localStorage['mainSecondaryTimezone'] = localStorage['timeOffset'];
        
        delete localStorage["showDate"];
        delete localStorage["useAltStyle"];
        delete localStorage["showBookmarksBar"];
        delete localStorage["currentStyle"];
        delete localStorage["24hrTime"];
        delete localStorage["timeOffset"];
        
        localStorage['version'] = getVersion();
        if(!silentUpdate)
            window.open(chrome.extension.getURL('options.html?about=1'));
    }*/
    
    if(!localStorage['mainBookmarksAutohideTime'] >= 0)
        localStorage['mainBookmarksAutohideTime'] = "10";
    
    // Page title
//    document.title = localStorage['translationsEnablePageTitle'] == "on" ? localStorage['translationsPageTitle'] : "New Tab";
    document.title = "New Tab";
    
    // Main clock
    var type = localStorage['mainPrimary24hour'] == "on" ? 1 : 0;
    var showDate = localStorage['mainPrimaryShowDate'] == "on" ? 1 : 0;
    updateClock("clock1", "date1", type, showDate);
    
    // Secondary clock
    if(localStorage['mainSecondaryEnable'] == "on")
    {
        $("#otherClocks").show()
        var type = localStorage['mainSecondary24hour'] == "on" ? 1 : 0;
        var showDate = localStorage['mainSecondaryShowDate'] == "on" ? 1 : 0;
        var offset = localStorage['mainSecondaryTimezone'];
        if(offset == null) offset = (new Date().getTimezoneOffset()/60)*-1;
        $("#title2").html("GMT " + offset)
        updateClock("clock2", "date2", type, showDate, offset);
    }
    
    // Bookmarks bar
    if(localStorage['mainBookmarksEnable'] == "on")
        $("#bookmarksBar").show();
    else
        $("#bookmarksBar").hide();

    // hide bookmarksBar if mouse is idle for 10 seconds.
    if(localStorage['mainBookmarksAutohide'] == "on")
    {
        var hideTimer;
        $(document).mousemove(function() {
            if (hideTimer)
            {
                clearTimeout(hideTimer);
                hideTimer = 0;
            }
            
            $('#bookmarksBar').slideDown('fast');
            
            hideTimer = setTimeout(function() {
                $('#bookmarksBar').slideUp('slow');
            }, localStorage['mainBookmarksAutohideTime'] * 1000)
        })
    }
    
    // Apps Page
    chrome.management.getAll(function(list) {
        for (var i in list)
        {
            var app = list[i];
            if(app.isApp && app.enabled)
            {
                var appId = app.id;
                var appName = app.name;
                var appIcon = findIcon(app.icons, 128);

                var a = document.createElement('a');
                $(a).click(function() { chrome.management.launchApp(this.id); });
                $(a).attr("href", "#");
                $(a).attr("id", appId);
                $(a).attr("class", "appIconPage");

                var icon = document.createElement('img');
                $(icon).attr("src", appIcon);
                $(icon).attr("height", "128");

                $(a).append(icon);
                $(a).append(appName);
                $('#appsPage').append(a);
            }
        }

        var appName = "Web Store";
        
        var a = document.createElement('a');
        $(a).attr("href", "https://chrome.google.com/webstore");
        $(a).attr("id", appId);
        
        var icon = document.createElement('img');
        $(icon).attr("src", "IDR_WEBSTORE_ICON.png");
        $(icon).attr("height", "128");
        
        $(a).append(icon);
        $(a).append(appName);
        $('#appsPage').append(a);
    });
    
    // Page switcher
    $('html, body').stop().animate({
        scrollLeft: $("#page1").offset().left
    }, 500);
    currentPage = 1;
    if($("#page2").length > 0)
    {
        $("#pageNav").show();
        $("#left").click(function() {
            var newPage = "#page" + (currentPage-1);
            if($(newPage).length > 0)
            {
                goToPage(newPage);
                currentPage--;
                event.preventDefault();
            }
            
            showHideNav();
        });
        $("#right").click(function() {
            var newPage = "#page" + (currentPage+1);
            if($(newPage).length > 0)
            {
                goToPage(newPage);
                currentPage++;
                event.preventDefault();
            }
            
            showHideNav();
        });
        
        showHideNav();
        function showHideNav()
        {
            if(currentPage == 1)
                $("#left").hide();
            else
                $("#left").show();
                
            if($("#page" + (currentPage+1)).length > 0)
                $("#right").show();
            else
                $("#right").hide();
        }
    }
    
    // Allows middle click to scroll through pages
	$('body').mousedown(function(e){
        //console.log(e);
        if(e.button==1)return false
        /*if(e.button==1) {
            if($("#page" + (currentPage+1)).length > 0)
                $("#right").click();
            else {
                goToPage("#page1");
                currentPage = 1;
            }
            showHideNav();
            return false;
        }*/
    });
});

function goToPage(newPage)
{
    $('html, body').stop().animate({
        scrollLeft: $(newPage).offset().left
    }, 500);
}

// Scrolls the window back to 0,0 to show the first page again on reloads
$(window).bind('beforeunload', function(){
    window.scroll(0,0);
    currentPage=1;
});
$(window).resize(function() {
    $('html, body').stop().animate({
        scrollLeft: $("#page"+currentPage).offset().left
    }, 200);
});

/**
* Returns the version of the extension
* Same function is in options.js, should probably combine it.
*
* @return {string} Returns the version of the extension
*/
function getVersion()
{
    var version = 'NaN';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', chrome.extension.getURL('manifest.json'), false);
    xhr.send(null);
    var manifest = JSON.parse(xhr.responseText);
    return manifest.version;
}


String.prototype.format = function() {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};