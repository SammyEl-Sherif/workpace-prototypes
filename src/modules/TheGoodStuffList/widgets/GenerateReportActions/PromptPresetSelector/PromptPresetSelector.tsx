import { Select } from '@workpace/design-system'
import styles from './PromptPresetSelector.module.scss'

const enum PresetOption {
  LinkedInBio = 'Generate me 2 to 3 sentences',
}

export const PromptPresetSelector = () => {
  return (
    <div className={styles.container}>
      <div style={{ position: 'relative' }}>
        <Select
          label={'Preset'}
          defaultValue={'Year End Review'}
          className={styles.select}
          required
        >
          <option>Year End Review</option>
          <option>LinkedIn Bio</option>
          <option>GitHub Profile</option>
        </Select>
      </div>
    </div>
  )
}
