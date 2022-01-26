import { useMachine } from '@xstate/react';
import { useEffect, useState } from 'react';
import { wykopMachine } from './wykopMachine';
import xstateLogo from './assets/xstate-logo.svg'
import wykopLogo from './assets/wykop-logo.png'

import './App.css'
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase/config';

const App = () => {

  const [searchTerm, setSearchTerm] = useState('')
  const [count, setCount] = useState(null)
  
  const [current, send] = useMachine(wykopMachine)
  const { wykopTag, posts } = current.context;

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm) {
        send('SELECT', { name: searchTerm });
      }
    }, 1000)
    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "counter", "count"), (doc) => {
      setCount(doc.data().count)
    });
    return () => unsub()
  }, [])
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      console.log(e.target.value)
    }
  }
  
  return (
    <div className='App'>
      <div className='logo-wrapper'>
        <img src={xstateLogo} alt="xstate logo" className='xstate-logo' />
        <span className='plus'>+</span>
        <img src={wykopLogo} alt="wykop logo" className='wykop-logo' />
      </div>
      <p className='welcome-sentence'>Wpisz swój ulubiony tag poniżej ⬇️⬇️</p>
      <div className='input-container'>
        <span className='hash-tag'>#</span>
        <input
          type="text"
          className='tag-input'
          autoComplete='off'
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <p className='counter'>Wyszukiwań dotychczas: {count && count}</p>
      <ul>
        {posts && posts.map(post => {
          return (
            <a href={post.source_url} target='_blank' key={post.id}>
              <li className='single-post' >
                <div>
                  <img src={post.preview} />
                </div>
                <div>
                  <p className='post-title'>{post.title}</p>
                  <p className='post-description'>{post.description}</p>
                  <p className='post-tags'>{post.tags}</p>
                </div>
              </li>
            </a>
          )
      })}

      </ul>
    </div>
  )
};

export default App;
