import { forwardRef, useState } from 'react'

import { FormProvider, useForm } from 'react-hook-form'
import Loading from 'react-loading'

import { UsersRecord } from '@/pocketbase-types'

import inputStyles from './InputField.module.scss'
import styles from './SignInForm.module.scss'

interface InputFieldProps extends React.ComponentPropsWithoutRef<'input'> {
  label?: React.ReactNode
  icon?: React.ReactNode
  errorText?: React.ReactNode
  helperText?: React.ReactNode
}

const InputField = ({ label, icon, errorText, helperText, ...props }: InputFieldProps) => {
  return (
    <div>
      <input title={label as string} className={inputStyles.fieldWrapper} {...props} />
    </div>
  )
}

interface FormStateProps {
  email: UsersRecord['email']
  password: UsersRecord['password']
  id: UsersRecord['id']
  name: UsersRecord['name']
}

const SignInForm = forwardRef(() => {
  const [{ username, password }, setState] = useState<{ username: string; password: string }>({
    username: '',
    password: '',
  })
  const methods = useForm<FormStateProps>()
  const [{ isLoading, isError }, setFormState] = useState({ isLoading: false, isError: '' })

  return (
    <FormProvider {...methods}>
      <div className={styles.container}>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '32px' }}>
              <div>Dude, go ahead ... Sign In ... 😎 </div>
              {/* <div>{isAuthenticated ? "✅" : "🚫"}</div> */}
            </div>
            <InputField
              {...methods.register('email')}
              label="username"
              placeholder="guy.jones@gmail.com"
              onChange={(e) => {
                setState({ username: e.target.value, password })
                methods.setValue('email', e.target.value)
              }}
            />
            <InputField
              {...methods.register('password')}
              label="password"
              placeholder="password123"
              onChange={(e) => {
                setState({ username, password: e.target.value })
                methods.setValue('password', e.target.value)
              }}
            />
            {isError && <>{isError}</>}
            <button className={styles.button}>Sign In</button>
          </>
        )}
      </div>
    </FormProvider>
  )
})
SignInForm.displayName = 'SignInForm'
export default SignInForm
