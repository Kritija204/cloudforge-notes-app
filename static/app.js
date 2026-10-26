const form=document.querySelector('#noteForm');
const titleInput=document.querySelector('#title');
const contentInput=document.querySelector('#content');
const notesEl=document.querySelector('#notes');
const messageEl=document.querySelector('#message');
const countEl=document.querySelector('#count');
function setMessage(text,isError=false){messageEl.textContent=text;messageEl.classList.toggle('error',isError)}
function safeDate(value){try{return new Date(value).toLocaleString()}catch{return ''}}
function renderNotes(notes){countEl.textContent=`${notes.length} / 50`;notesEl.replaceChildren();if(!notes.length){const empty=document.createElement('div');empty.className='empty';empty.textContent='No notes yet. Save your first idea above.';notesEl.append(empty);return}for(const note of notes){const card=document.createElement('article');card.className='note';const h=document.createElement('h3');h.textContent=note.title;const p=document.createElement('p');p.textContent=note.content;const bottom=document.createElement('div');bottom.className='note-bottom';const time=document.createElement('span');time.textContent=safeDate(note.created_at);const del=document.createElement('button');del.className='delete';del.type='button';del.textContent='Delete ×';del.addEventListener('click',()=>deleteNote(note.id));bottom.append(time,del);card.append(h,p,bottom);notesEl.append(card)}}
async function loadNotes(){try{const r=await fetch('/api/notes');if(!r.ok)throw new Error('Could not load notes');renderNotes(await r.json())}catch(e){notesEl.textContent='Could not load notes. Refresh the page or check the app logs.'}}
form.addEventListener('submit',async e=>{e.preventDefault();const button=form.querySelector('button[type="submit"]');button.disabled=true;setMessage('Saving…');try{const r=await fetch('/api/notes',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:titleInput.value,content:contentInput.value})});const data=await r.json();if(!r.ok)throw new Error(data.error||'Save failed');form.reset();setMessage('Note saved successfully.');await loadNotes()}catch(err){setMessage(err.message||'Could not save note.',true)}finally{button.disabled=false}});
async function deleteNote(id){try{const r=await fetch(`/api/notes/${id}`,{method:'DELETE'});if(!r.ok)throw new Error('Delete failed');setMessage('Note deleted.');await loadNotes()}catch(e){setMessage(e.message,true)}}
document.querySelector('#refresh').addEventListener('click',loadNotes);loadNotes();
