
import React from "react";



const Login = () =>{

    const [loginForm, setLoginForm] = React.useState({
        username: '',
        password: ''
      });
    
      // Register form state
      const [registerForm, setRegisterForm] = React.useState({
        username: '',
        password: '',
        confirmPassword: '',
        role: UserRoles.RegularUser
      });

    <div className="max-w-6xl mx-auto">
    <div className="grid md:grid-cols-2 gap-6">
      {/* Login Card */}
      <div className="bg-white rounded-[var(--border-radius-lg)] shadow-[var(--shadow-md)] p-6">
        <h2 className="text-2xl font-bold text-center text-[var(--text-primary)] mb-6">
          Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              value={loginForm.username}
              onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
              className="w-full px-3 py-2 border border-[var(--border-color)] rounded-[var(--border-radius-md)]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
              className="w-full px-3 py-2 border border-[var(--border-color)] rounded-[var(--border-radius-md)]"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-[var(--primary-green)] hover:bg-[var(--primary-green-hover)] text-white rounded-[var(--border-radius-md)] transition-colors"
          >
            Login
          </button>
        </form>
      </div>

      {/* Register Card */}
      <div className="bg-white rounded-[var(--border-radius-lg)] shadow-[var(--shadow-md)] p-6">
        <h2 className="text-2xl font-bold text-center text-[var(--text-primary)] mb-6">
          Register
        </h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Choose a username"
              value={registerForm.username}
              onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
              className="w-full px-3 py-2 border border-[var(--border-color)] rounded-[var(--border-radius-md)]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Choose a password"
              value={registerForm.password}
              onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
              className="w-full px-3 py-2 border border-[var(--border-color)] rounded-[var(--border-radius-md)]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={registerForm.confirmPassword}
              onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
              className="w-full px-3 py-2 border border-[var(--border-color)] rounded-[var(--border-radius-md)]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              Account Type
            </label>
            <select
              value={registerForm.role}
              onChange={(e) => setRegisterForm({...registerForm, role: e.target.value})}
              className="w-full px-3 py-2 border border-[var(--border-color)] rounded-[var(--border-radius-md)]"
            >
              <option value={UserRoles.RegularUser}>Regular User</option>
              <option value={UserRoles.FoodProducer}>Food Producer</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-[var(--success-green)] hover:opacity-90 text-white rounded-[var(--border-radius-md)] transition-colors"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  </div>
}

export default Login;

