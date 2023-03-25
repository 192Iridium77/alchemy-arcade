const generateConfig = () => {
  return `
    input_player1_select = shift
    audio_latency = 64
    video_vsync = true
    savefile_directory = /save/files
    savestate_directory = /save/states
    savestate_auto_load = true
    system_directory = /
    `;
};

export { generateConfig };
