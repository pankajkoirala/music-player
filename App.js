import React from 'react'

import RootNavigation from './src/navigation/rootNavigatoe'
import AudioProvider from './src/context/audioProvider';

export default App = () => {
  return (
    // <ClassComponent />
    // <FunctionComponent />
    // <NewComponent />
    // <NewComponentFunction />
    <AudioProvider>
      <RootNavigation />
    </AudioProvider>
  )
}