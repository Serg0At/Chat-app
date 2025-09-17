import { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import BorderAnimatedContainer from '../components/BorderAnimatedContainer'
import { MessageCircleIcon, LockIcon, MailIcon, UserIcon, LoaderIcon } from "lucide-react";

function SignUpPage() {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' })
  const [signup, isSigningUp] = useAuthStore
  const handleSubmit = (e) => {}

  return (
    <div className='w-full flex items-center justify-center p-4 bg-slate-900'>
      <div className='relative w-full max-w-6xl md:h-[800px] h-[650px]'>
        <BorderAnimatedContainer>
          <div className='w-full flex flex-col md:flex-row'>
            {/* FORM CLOUMN - LEFT SIDE */}
            <div className='md:w-1/2 p-8 flex items-center justify-center md:border-r border-slate-600/30'>
              <div className='w-full max-w-md'>
                {/* HEADING TEXT */}
                  <div className="text-center mb-8">
                    <MessageCircleIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                    <h2 className="text-2xl font-bold text-slate-200 mb-2">Create Account</h2>
                    <p className="text-slate-400">Sign up for a new account</p>
                  </div>

                  {/* FORM */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* FULL NAME */}
                    <div>
                      <label className="auth-input-label">Full Name</label>
                      <div className="relative">
                        <UserIcon className="auth-input-icon" />

                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="input"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                  </form>
                </div>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  )
}

export default SignUpPage