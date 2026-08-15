import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Uncaught error in app:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="max-w-[700px] mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
          <p className="text-gray-500 text-sm mb-4">{this.state.error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2.5 px-4 rounded-lg transition"
          >
            Reload page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
