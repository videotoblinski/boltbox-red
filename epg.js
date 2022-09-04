// Public-domain EPG simulation JS
// written by VideoToblin

class MenuLabels {
  constructor (
    guide = "Program Guide",
    dvr = "DVR Recordings",
    ie = "Internet Browser",
    patv = "Public Access TV",
    about = "About",
    settings = "Settings",
    rescan = "Rescan Channels",
    reboot = "Reboot BoltBox&trade; Red"
  ) {
    this.ProgramGuide = guide;
    this.DVRRecordings = dvr;
    this.InternetBrowser = ie;
    this.PublicAccessTV = patv;
    this.About = about;
    this.Settings = settings;
    this.Rescan = rescan;
    this.Reboot = reboot;
  }
}

var DishMenuLabels = new MenuLabels();

class CableProvider {
  Name = "Carrier0"
  constructor(
    name = "Dish Network",
    shortname = "Dish",
    css = "dish.css",
    logo = "dish.svg",
    quality = "",
    strings = DishMenuLabels,
    enableBrowser = true
  ) {
    this.Name = name;
    this.ShortName = shortname;
    this.Logo = logo;
    this.Quality = quality;
    this.Stylesheet = css;
    this.Strings = strings;
    this.BrowserEnabled = enableBrowser;
    this.ServiceMode = false;
    this.ServiceGet = true;
  }

  DisableService() {
    this.ServiceGet = false;
  }

  GetServiceEnabled () { return this.ServiceGet; }
}

var NoProvider = new CableProvider("Terminated", "None", "base.css", "#null", "No Service", DishMenuLabels);
NoProvider.DisableService();

var ServModeProvider = new CableProvider("Service Mode", "None", "base.css", "#null", "BoltBox Service Mode", DishMenuLabels, false);
ServModeProvider.ServiceMode = true;
ServModeProvider.ServiceGet = false;

var DirecTVProvider = new CableProvider("DirecTV", "DirecTV", "directv.css", "directv.svg", "HD", DishMenuLabels, false);
var DishProvider = new CableProvider();

var serviceGet = false;
function loadProvider(provider) {
  serviceGet = provider.ServiceGet;

  // fix branding
  document.getElementById("prov_css").href = provider.Stylesheet;
  document.getElementById("logo").src = provider.Logo;
  document.getElementById("hd").innerHTML = provider.Quality;
  
  // fix button
  document.getElementById("cycle").innerHTML = "Change provider: "+provider.ShortName;
  
  // theme every button on the main menu
  document.getElementById("epg").innerHTML = provider.Strings.ProgramGuide;
  document.getElementById("dvr").innerHTML = provider.Strings.DVRRecordings;
  document.getElementById("web").innerHTML = provider.Strings.InternetBrowser;
  document.getElementById("ptv").innerHTML = provider.Strings.PublicAccessTV;
  document.getElementById("abt").innerHTML = provider.Strings.About;
  document.getElementById("hax").innerHTML = provider.Strings.Settings;
  document.getElementById("rsc").innerHTML = provider.Strings.Rescan;
  document.getElementById("rbt").innerHTML = provider.Strings.Reboot;

  // enforce provider policies
  if (!provider.BrowserEnabled) document.getElementById("web").style.display = "none";
                           else document.getElementById("web").style.display = "block";
}

// Get a nice HTML string for the current time
function getTime() {
  // make human-readable time array
  var pm = false;
  var time = Date().split(" ")[4].split(":")
  var timestring = "<strong>"
  for (var i=0; i<time.length; i++) time[i] = parseInt(time[i])
  if (time[0] > 12) {
    time[0] = time[0] - 12;
    pm = true;
  }

  // assemble string
  timestring += time[0]+":"
  if (time[1] < 10)
    timestring+="0"
  timestring+=time[1]+":"
  if (time[2] < 10)
    timestring+="0"
  timestring+=time[2]
  timestring+=" <small>"
  if (pm) timestring += "PM"
     else timestring += "AM"
  timestring+="</small></b>"

  return timestring
}
var disk_size = 305;
var dvhs_connected = false;
var plugged_in = true;
function toggle_connect_vcr() {
  window.setTimeout(function(){
    dvhs_connected = !dvhs_connected
    if (dvhs_connected) {
      document.getElementById("dvhs_status").innerHTML = "D-VHS recorder connected.";
      document.getElementById("dvhs_size").innerHTML = "D-VHS tape blank";
      document.getElementById("dvr_status").innerHTML = "DVR overflow enabled.";
    } else {
      document.getElementById("dvhs_status").innerHTML = "No D-VHS recorder is connected.";
      document.getElementById("dvhs_size").innerHTML = "No VCR connected";
      document.getElementById("dvr_status").innerHTML = "DVR will be limited to HDD only.";
    }
  }, 200);
}
function upgrade_hdd() {
  disk_size += 150;
  document.getElementById("hdd_size").innerHTML = disk_size+"MB free on HDD1";
}
function unplug() {
  plugged_in = !plugged_in;
  if (plugged_in) {
    document.getElementsByClassName("epg")[0].style.display = "block";
    document.getElementById("blackout").style.display = "none";
  } else {
    document.getElementsByClassName("epg")[0].style.display = "none";
    document.getElementById("blackout").style.display = "block";
  }
}
var provid = 0;
function cycle(providers) {
  provid++;
  if (provid==providers.length) provid = 0;
  loadProvider(providers[provid]);
}

function guide() {
  document.getElementById("mainmenu").style.display = "none";
  document.getElementById("guide").style.display = "table-cell";
}
function main() {
  document.getElementById("mainmenu").style.display = "table-cell";
  document.getElementById("guide").style.display = "none";
}
function servicecheck(ifservice) {
  if (serviceGet) { ifservice(); }
  else {
    var epgAlert = document.createElement("div");
    epgAlert.innerHTML = "<h2 class=\"alert_heading\">No service</h2><p class=\"alert_body\">Please contact 1-800-555-SRVC for more information.</p><br><button class=\"alert_button\">OK</button>";
    document.getElementsByClassName("epg")[0].appendChild(epgAlert);
  }
}
