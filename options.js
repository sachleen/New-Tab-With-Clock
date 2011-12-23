/**
* Stuff to be done at launch
*/
$(document).ready(function() {
    /*
     * Load settings
     */
    $(":checkbox").each(function() {
        $(this).attr("checked", localStorage[this.id] == "on" ? true : false );
    });
    $('#mainPrimaryDateFormat').attr("value", localStorage["mainPrimaryDateFormat"]);
    $('#mainSecondaryTimezone').attr("value", localStorage["mainSecondaryTimezone"]);
    $('#mainBookmarksAutohideTime').attr("value", localStorage["mainBookmarksAutohideTime"]);
    $('#themeStyle').html(localStorage['themeStyle']);
    $('#themeJS').html(localStorage['themeJS']);
    $('#translationsPageTitle').attr("value", localStorage["translationsPageTitle"]);
    $('#translationsDays').html(localStorage['translationsDays']);
    $('#translationsMonths').html(localStorage['translationsMonths']);
    refreshSettings();
    
    /*
     * Save settings
     */
    $(":checkbox").change(function() {
        localStorage[this.id] = $("#" + this.id).attr("checked") == true ? "on" : "off"
        refreshSettings();
    });
    $('#mainPrimaryDateFormat, #mainSecondaryTimezone, #translationsPageTitle, #mainBookmarksAutohideTime').change(function() {
        localStorage[this.id] = this.value;
    });
    $('#themeSave, #themeJSSave, #translationsDaysSave, #translationsMonthsSave').click(function() {
        switch(this.id)
        {
            case "themeSave": 
                localStorage['themeStyle'] = $('#themeStyle').val();
                break;
            case "themeJSSave": 
                localStorage['themeJS'] = $('#themeJS').val();
                break;
            case "translationsDaysSave":
                var len = $('#translationsDays').val().split(',').length;
                if(len != 7)
                    alert("There should be 7 days, separated by commas. It looks like you entered " + len + ".");
                else
                    localStorage['translationsDays'] = $('#translationsDays').val();
                break;
            case "translationsMonthsSave":
                var len = $('#translationsMonths').val().split(',').length;
                if(len != 12)
                    alert("There should be 12 months, separated by commas. It looks like you entered " + len + ".");
                else
                localStorage['translationsMonths'] = $('#translationsMonths').val();
                break;
        }
    });
    
    /*
     * Navigation
     */
    $('#nav').children().click(function() {
        $('#nav').children().attr('class','')
        $(this).attr("class", "selected");
        $('.page').each(function(index) {
            $(this).hide();
        });
        $("#" + this.id + "Page").show();
    });
    
    /*
     * First run
     * chrome-extension://lpjpmnjpdpbbhigomnnijfdlnkapencd/options.html?about=1
     */
    if(gup('about') != "")
        $('#about').click();
    $('#extensionVersion').html(getVersion());
});


/**
* Handles enabling/disabling of fields if feature is enabled/disabled
*
*/
function refreshSettings()
{
    // Main > Primary Clock > Show Date
    if($('#mainPrimaryShowDate').attr("checked") == false)
        $('#mainPrimaryDateFormat').attr("disabled", true);
    else
        $('#mainPrimaryDateFormat').attr("disabled", false);
    
    // Main > Secondary Clock
    if($('#mainSecondaryEnable').attr("checked") == false)
        $('#mainSecondary24hour, #mainSecondaryShowDate, #mainSecondaryTimezone').attr("disabled", true);
    else
        $('#mainSecondary24hour, #mainSecondaryShowDate, #mainSecondaryTimezone').attr("disabled", false);
    
    // Main > Bookmarks
    if($('#mainBookmarksEnable').attr("checked") == false)
        $('#mainBookmarksAutohide, #mainBookmarksHideText, #mainBookmarksAutohideTime').attr("disabled", true);
    else
        $('#mainBookmarksAutohide, #mainBookmarksHideText, #mainBookmarksAutohideTime').attr("disabled", false);
    
    // Theme > Custom Styles
    if($('#themeEnableCSS').attr("checked") == false)
        $('#themeStyle, #themeSave').attr("disabled", true);
    else
        $('#themeStyle, #themeSave').attr("disabled", false);
    
    // Theme > Custom JS
    if($('#themeEnableJS').attr("checked") == false)
        $('#themeJS, #themeJSSave').attr("disabled", true);
    else
        $('#themeJS, #themeJSSave').attr("disabled", false);
        
    // Translations > Page Title
    if($('#translationsEnablePageTitle').attr("checked") == false)
        $('#translationsPageTitle').attr("disabled", true);
    else
        $('#translationsPageTitle').attr("disabled", false);
    
    // Translations > Days
    if($('#translationsEnableDays').attr("checked") == false)
        $('#translationsDays, #translationsDaysSave').attr("disabled", true);
    else
        $('#translationsDays, #translationsDaysSave').attr("disabled", false);
    
    // Translations > Months
    if($('#translationsEnableMonths').attr("checked") == false)
        $('#translationsMonths, #translationsMonthsSave').attr("disabled", true);
    else
        $('#translationsMonths, #translationsMonthsSave').attr("disabled", false);
}

/**
* Gets URL paramaters
*
* @param {string} name URL paramater to get
* @return {string} Returns the value of that paramater
*/
function gup(name)
{
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );
    if( results == null )
        return "";
    else
        return results[1];
}

/**
* Returns the version of the extension
* Same function is in js.js, should probably combine it.
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