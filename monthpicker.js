"use strict"
/*
    __author__ = "alvarosperez",
    __github__ = "https://github.com/alvarosperez/simplestMonthpicker";

    Simplest monthpicker, pure javascript.

    * selector is CSS selector for container div (must have height/width)
    * possible options:
        - months: list of 12 strings with months' names.
        - minDate: lower bound, in the format "YYYY.MM"
        - maxDate: upper bound, in the format "YYYY.MM"
        - selectedMonth: default month
        - selectedYear: default year, current if empty
        - selectCallback: function executed after a month is selected, arguments are YEAR and MONTH

    Examples of use:
        var m1 = Monthpicker("#container1");
        var m2 = Monthpicker("#container2", {"minDate": "2016.12"});
        var m3 = Monthpicker("#container3", {"selectCallback": function(year, month){ ... }});
*/
var Monthpicker = function(selector, options){
    var self = {};
    options = options || {};

    self.showYear = function(year){
        if (self.minDate && year < parseInt(self.minDate.split(".")[0])
            || self.maxDate && year > parseInt(self.maxDate.split(".")[0])) {
            return;
        }

        self.parent.querySelector(".yearSwitch.down").classList.remove("off");
        self.parent.querySelector(".yearSwitch.up").classList.remove("off");
        for (var i = 0; i < self.monthElements.length; i++) {
            self.monthElements[i].classList.remove("off");
        }

        if (self.minDate && year == parseInt(self.minDate.split(".")[0])) {
            var min_month = parseInt(self.minDate.split(".")[1]);
            for (var i = min_month - 1; i >= 1; i--) {
                self.parent.querySelector(".month" + i).className += " off";
            }

            self.parent.querySelector(".yearSwitch.down").className += " off";
        } else if (self.maxDate && year == parseInt(self.maxDate.split(".")[0])) {
            var max_month = parseInt(self.maxDate.split(".")[1]);
            for (var i = max_month + 1; i <= 12; i++) {
                self.parent.querySelector(".month" + i).className += " off";
            }

            self.parent.querySelector(".yearSwitch.up").className += " off";
        }

        self.currentYear = year;
        self.parent.querySelector(".yearValue").innerHTML = self.currentYear;

        if (self.currentYear == self.selectedYear && self.selectedMonth) {
            self.parent.querySelector(".month" + self.selectedMonth).className += " selected";
        } else {
            var selected = self.parent.querySelector(".month.selected");
            if (selected){
                selected.classList.remove("selected");
            }
        }
    }
    self.prevYear = function(){
        event.stopPropagation();

        self.showYear(self.currentYear - 1);
    }
    self.nextYear = function(){
        event.stopPropagation();

        self.showYear(self.currentYear + 1);
    }
    self.clickMonthElement = function(elem) {
        if (elem.classList.contains("off"))
            return;

        var selected = self.parent.querySelector(".month.selected");
        if (selected){
            selected.classList.remove("selected");
        }
        elem.className += " selected";

        self.selectedMonth = elem.getAttribute("data-m");
        self.selectedYear = self.currentYear;

        self.text.innerHTML = self.months[self.selectedMonth - 1] + " " + self.selectedYear;

        if(options.selectCallback) {
            options.selectCallback(self.selectedYear, self.selectedMonth);
        }
    }
    self.clickMonth = function(){
        self.clickMonthElement(this);
    }
    self.selectMonth = function(month) {
        var month_element = self.parent.querySelector(".month" + month);

        self.clickMonthElement(month_element);
    }
    self.showSelected = function(){
        self.showYear(self.selectedYear);
    }
    self.showTable = function(){
        if (self.shown) {
            self.hideTable();
        } else {
            self.shown = true;
            self.table.style.display = "block";
            self.showSelected();
        }
    }
    self.hideTable = function(){
        self.shown = false;
        self.table.style.display = "none";
    }
    self.initializeOptions = function(options){
        self.months = options.months ? options.months : ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        self.minDate = options.minDate ? options.minDate : false;
        self.maxDate = options.maxDate ? options.maxDate : false;
        self.selectedMonth = options.selectedMonth ? options.selectedMonth : false;

        if (options.selectedYear){
            self.selectedYear = self.currentYear= options.selectedYear;
        } else {
            var a = new Date;
            self.selectedYear = self.currentYear = a.getFullYear();
        }
    }
    self.initializeElements = function(selector){
        var myHtml  = '<table class="monthpicker">';
            myHtml += '    <style type="text/css">';
            myHtml += '        table.monthpicker {position: absolute; top: 100%; z-index: 99999; background: white; border-radius:4px; padding: 10px; font-size: 12px; text-align: center;border-spacing: 0;border-collapse: collapse; -webkit-user-select: none; /* Chrome/Safari */ -moz-user-select: none; /* Firefox */ -ms-user-select: none; /* IE10+ */}';
            myHtml += '        table.monthpicker .yearSwitch{background: #d1d1d1; padding: 2px 10px; border-radius: 4px; cursor: pointer;}';
            myHtml += '        table.monthpicker .yearValue{font-size: 14px;}';
            myHtml += '        table.monthpicker td.month{cursor: pointer; border-radius: 4px; padding: 4px 12px;}';
            myHtml += '        table.monthpicker td.month:hover{background: #00C6D7;}';
            myHtml += '        table.monthpicker td.month.selected{background: #990099; color: white;}';
            myHtml += '        table.monthpicker .off{color: #888; cursor: not-allowed !important; background: transparent !important;}';
            myHtml += '    </style>';
            myHtml += '    <tr>';
            myHtml += '        <td>';
            myHtml += '            <span class="yearSwitch down">&lt;</span>';
            myHtml += '        </td>';
            myHtml += '        <td>';
            myHtml += '            <div class="yearValue">' + self.currentYear + '</div>';
            myHtml += '        </td>';
            myHtml += '        <td>';
            myHtml += '            <span class="yearSwitch up">&gt;</span>';
            myHtml += '        </td>';
            myHtml += '    </tr>';
            myHtml += '    <tr>';
            myHtml += '        <td class="month month1" data-m="1">' + self.months[0] + '</td>';
            myHtml += '        <td class="month month2" data-m="2">' + self.months[1] + '</td>';
            myHtml += '        <td class="month month3" data-m="3">' + self.months[2] + '</td>';
            myHtml += '    </tr>';
            myHtml += '    <tr>';
            myHtml += '        <td class="month month4" data-m="4">' + self.months[3] + '</td>';
            myHtml += '        <td class="month month5" data-m="5">' + self.months[4] + '</td>';
            myHtml += '        <td class="month month6" data-m="6">' + self.months[5] + '</td>';
            myHtml += '    </tr>';
            myHtml += '    <tr>';
            myHtml += '        <td class="month month7" data-m="7">' + self.months[6] + '</td>';
            myHtml += '        <td class="month month8" data-m="8">' + self.months[7] + '</td>';
            myHtml += '        <td class="month month9" data-m="9">' + self.months[8] + '</td>';
            myHtml += '    </tr>';
            myHtml += '    <tr>';
            myHtml += '        <td class="month month10" data-m="10">' + self.months[9] + '</td>';
            myHtml += '        <td class="month month11" data-m="11">' + self.months[10] + '</td>';
            myHtml += '        <td class="month month12" data-m="12">' + self.months[11] + '</td>';
            myHtml += '    </tr>';
            myHtml += '</table>';

        // container
        self.container = document.querySelector(selector);
        self.container_properties = getComputedStyle(self.container);

        // monthpicker
        self.parent = document.createElement("div");
        self.parent.innerHTML = myHtml;
        self.parent.className = "monthpicker";
        self.parent.tabIndex = "-1";
        self.parent.style.cursor = "pointer";
        self.parent.style.outline = 0;
        self.parent.style.width = self.container_properties.getPropertyValue("width");
        self.parent.style.height = self.container_properties.getPropertyValue("height");
        self.parent.style.position = "relative";

        self.container.appendChild(self.parent);

        // text
        self.text = document.createElement("div");
        self.text.className = "monthpicker-text";
        self.text.style.textAlign = "center";
        self.text.style.lineHeight = self.container_properties.getPropertyValue("height");
        self.text.style.width = self.container_properties.getPropertyValue("width");
        self.text.style.height = self.container_properties.getPropertyValue("height");

        // if default year and month, set text
        if (self.selectedMonth) {
            //self.selectMonth(self.selectedMonth);
            self.text.innerHTML = self.months[self.selectedMonth - 1] + " " + self.selectedYear;
        }

        self.parent.appendChild(self.text);

        // table
        self.table = self.parent.querySelector("table");
        self.table.style.display = "none";
    }
    self.initializeEvents = function(){
        self.shown = false;
        self.container.addEventListener("click", self.showTable);
        self.parent.addEventListener("blur", self.hideTable);
        self.parent.querySelector(".yearSwitch.down").addEventListener("click", self.prevYear);
        self.parent.querySelector(".yearSwitch.up").addEventListener("click", self.nextYear);
        self.monthElements = self.parent.querySelectorAll(".month");
        for (var i = 0; i < self.monthElements.length; i++) {
            self.monthElements[i].addEventListener("click", self.clickMonth);
        }
    }

    self.initializeOptions(options);
    self.initializeElements(selector);
    self.initializeEvents();

    return self;
};
