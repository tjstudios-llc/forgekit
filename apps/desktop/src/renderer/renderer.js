const templateSelect=document.querySelector("#template");
const nameInput=document.querySelector("#name");
const directoryInput=document.querySelector("#directory");
const status=document.querySelector("#status");
for(const item of await window.forgekit.getTemplates()){
  const option=document.createElement("option");option.value=item.id;option.textContent=item.title+" — "+item.description;templateSelect.append(option);
}
document.querySelector("#browse").addEventListener("click",async()=>{
  const folder=await window.forgekit.chooseDirectory();if(folder)directoryInput.value=folder;
});
document.querySelector("#create").addEventListener("click",async()=>{
  const name=nameInput.value.trim();const parentDirectory=directoryInput.value;
  if(!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,47}$/.test(name)){status.textContent="Enter a valid project name.";return;}
  if(!parentDirectory){status.textContent="Choose a parent directory.";return;}
  status.textContent="Creating project…";
  try{
    const result=await window.forgekit.createProject({name,template:templateSelect.value,parentDirectory});
    status.textContent="Created "+result.targetDir;
    await window.forgekit.showFolder(result.targetDir);
  }catch(error){status.textContent=error.message;}
});
