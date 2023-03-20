/* eslint-disable */

var count = 0;
function runEmulator(files) {
  count = files.length;
  document.getElementById("openrom").innerHTML = "";
  document.getElementById("openrom").style.display = "none";
  for (var i = 0; i < files.length; i++) {
    filereader = new FileReader();
    filereader.file_name = files[i].name;
    filereader.onload = function () {
      initFromData(this.result, this.file_name);
    };
    filereader.readAsArrayBuffer(files[i]);
  }
}

function initFromData(data, name) {
  var dataView = new Uint8Array(data);
  Module.FS_createDataFile("/", name, dataView, true, false);
  count--;
  if (count === 0) {
    Module.FS_createFolder("/", "etc", true, true);
    var config = "input_player1_select = shift\n";
    var latency = parseInt(document.getElementById("latency").value, 10);
    if (isNaN(latency)) latency = 96;
    config += "audio_latency = " + latency + "\n";
    if (document.getElementById("vsync").checked)
      config += "video_vsync = true\n";
    else config += "video_vsync = false\n";
    Module.FS_createDataFile("/etc", "retroarch.cfg", config, true, true);
    document.getElementById("canvas_div").style.display = "block";
    document.getElementById("vsync").disabled = true;
    document.getElementById("vsync-label").style.color = "gray";
    document.getElementById("latency").disabled = true;
    document.getElementById("latency-label").style.color = "gray";
    Module["callMain"](Module["arguments"]);
  }
}
