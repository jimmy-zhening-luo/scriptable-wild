class System {
  static init(
    doInstallLibrariesFromRepo = false,
    doInstallScriptsFromRepo = false
  ) {
    if (
      doInstallLibrariesFromRepo === true
    ) this.#installLibrariesFromRepo();
    if (doInstallScriptsFromRepo === true)
      this.#installScriptsFromRepo();
  }
  
  static #installLibrariesFromRepo() {
    const iFm = FileManager.iCloud();
    const lFm = FileManager.local();
    const here = iFm.joinPath(
      iFm.bookmarkedPath(
        "iCloud/Scriptable"
      ),
      "lib"
    );
    const destination = here;
      
    const there = lFm.joinPath(
      lFm.bookmarkedPath(
        "Repositories/Scriptable/src"
      ),
      "lib"
    );
    const source = there;
    
    if (iFm.isDirectory(destination))
      iFm.remove(destination);
      
      iFm.copy(source, destination);
  }
  
  static #installScriptsFromRepo() {
    this.#pullScriptsFromRepo(false);
  }
  
  static #pushScriptsToRepo() {
    // TBD
  }
  
  static #pullScriptsFromRepo(
    force = false
  ) {
    if (force === true)
      pull(0);
    else {
      const confirm = new Alert();
      confirm.message = "Initializing scripts will delete all scripts in this Are you sure you want to override current production files?";
      confirm.addDestructiveAction("Yes, DELETE prod");
      confirm.addCancelAction("No, cancel");
      confirm.present().then((value) => (handle(value)));
      
      function pull(value = -1) {
        if (value === 0) {
          const iFm = FileManager.iCloud();
          const lFm = FileManager.local();
          const here = 
            iFm.bookmarkedPath(
              "iCloud/Scriptable"
            );
          const destination = here;
            
          const there = 
            lFm.bookmarkedPath(
              "Repositories/Scriptable/src"
            );
          const source = there;
          
          const scripts = iFm.listContents(here).filter((item) => (!item.startsWith("!") && !item === "lib"));
          
          console.log(scripts);
        }
      }
    }
  }
}

module.exports = System;
module.exports.System = System;
