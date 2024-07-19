import React from 'react'
import SettingsTabs from './SettingsTabs'
import UserProfileHeading from '@/components/common/UserProfileHeading'

const Settings = () => {
  return (
    <div className='user-page-content'>
        <UserProfileHeading title='Settings' />
        <SettingsTabs />
    </div>
  )
}

export default Settings