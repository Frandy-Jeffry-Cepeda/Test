import { useState, FormEvent, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [titulo, setTitulo] = useState('')
  const [contenido, setContenido] = useState('')
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('posts') // 'posts' o 'create'
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    return savedTheme || 'dark'
  })
  const mainContentRef = useRef<HTMLDivElement>(null)

  // Establecer el tema en el documento
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  // Alternar entre tema claro y oscuro
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark')
  }

  // Función para detectar cambios en el tamaño de la pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
      if (window.innerWidth > 768) {
        setIsMenuOpen(false) // Cerrar menú móvil cuando la pantalla es grande
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Detectar scroll para mostrar/ocultar el botón de volver arriba
  useEffect(() => {
    const handleScroll = () => {
      if (!mainContentRef.current) return
      const scrollTop = mainContentRef.current.scrollTop
      setShowBackToTop(scrollTop > 300)
    }

    const mainContent = mainContentRef.current
    if (mainContent) {
      mainContent.addEventListener('scroll', handleScroll)
      return () => mainContent.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Función para volver arriba
  const scrollToTop = () => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  // Función para obtener todos los posts
  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3000/api/posts/typeorm')
      const data = await response.json()
      
      if (data.success) {
        setPosts(data.data)
      } else {
        setMessage('Error al obtener los posts')
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage('Error de conexión con el servidor')
    } finally {
      setLoading(false)
    }
  }

  // Función para enviar un nuevo post
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!titulo.trim() || !contenido.trim()) {
      setMessage('Por favor completa todos los campos')
      return
    }
    
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3000/api/posts/typeorm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ titulo, contenido })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setMessage('Post creado exitosamente')
        setTitulo('')
        setContenido('')
        // Actualizar la lista de posts
        fetchPosts()
        // Cambiar a la pestaña de posts después de crear uno nuevo
        setActiveTab('posts')
        // Cerrar menú móvil si está abierto
        setIsMenuOpen(false)
      } else {
        setMessage(data.message || 'Error al crear el post')
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage('Error de conexión con el servidor')
    } finally {
      setLoading(false)
    }
  }

  // Limpiar mensaje después de 5 segundos
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  // Cargar posts al montar el componente
  useEffect(() => {
    fetchPosts()
  }, [])

  // Cambiar pestaña activa y cerrar menú móvil
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setIsMenuOpen(false)
  }

  return (
    <div className={`app-wrapper ${isMenuOpen ? 'menu-open' : ''} theme-transition`}>
      {/* Barra superior móvil */}
      <div className="topbar">
        <div className="logo-container">
          <span className="logo-icon">📝</span>
          <h1>NexoBlog</h1>
        </div>
        
        <button 
          className="menu-toggle" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-circle">
              <span className="logo-icon">📝</span>
            </div>
            <h2 className="logo-text">NexoBlog</h2>
          </div>
        </div>
        
        {/* Switch de tema */}
        <div className="theme-switch-container">
          <button 
            className={`theme-switch ${theme === 'light' ? 'light' : ''}`} 
            onClick={toggleTheme}
            aria-label={`Cambiar a tema ${theme === 'dark' ? 'claro' : 'oscuro'}`}
          >
            <div className="theme-icons">
              <span className="theme-icon moon-icon">🌙</span>
              <span className="theme-icon sun-icon">☀️</span>
            </div>
          </button>
        </div>
        
        <nav className="main-nav">
          <div className="nav-section">
            <h3 className="nav-title">Menú</h3>
            <ul className="nav-list">
              <li>
                <button 
                  className={`nav-button ${activeTab === 'posts' ? 'active' : ''}`}
                  onClick={() => handleTabChange('posts')}
                >
                  <span className="nav-icon">📰</span>
                  <span className="nav-label">Explorar Posts</span>
                </button>
              </li>
              <li>
                <button 
                  className={`nav-button ${activeTab === 'create' ? 'active' : ''}`}
                  onClick={() => handleTabChange('create')}
                >
                  <span className="nav-icon">✏️</span>
                  <span className="nav-label">Crear Post</span>
                </button>
              </li>
            </ul>
          </div>
          
          <div className="sidebar-footer">
            <div className="app-info">
              <span className="copyright">© {new Date().getFullYear()} NexoBlog</span>
              <span className="version">v1.0.0</span>
            </div>
          </div>
        </nav>
      </aside>
      
      {/* Overlay para cerrar menú en móvil */}
      {isMenuOpen && (
        <div className="sidebar-overlay" onClick={() => setIsMenuOpen(false)}></div>
      )}
      
      {/* Contenido principal */}
      <main className="main-container theme-transition" ref={mainContentRef}>
        <div className="content-wrapper">
          {message && (
            <div className={`alert-message ${message.includes('Error') ? 'error' : 'success'}`}>
              <span className="message-icon">{message.includes('Error') ? '⚠️' : '✅'}</span>
              <span className="message-text">{message}</span>
              <button className="close-message" onClick={() => setMessage('')}>×</button>
            </div>
          )}
          
          <div className="page-container">
            {activeTab === 'posts' ? (
              <div className="posts-page">
                <header className="page-header">
                  <h1 className="page-title">Explorar Posts</h1>
                  <p className="page-subtitle">Descubre contenido interesante compartido por la comunidad</p>
                </header>
                
                {loading ? (
                  <div className="loading-container">
                    <div className="loader"></div>
                    <p>Cargando contenido...</p>
                  </div>
                ) : posts.length > 0 ? (
                  <div className="posts-container">
                    {posts.map((post) => (
                      <article key={post.id} className="post-card theme-transition">
                        <div className="post-header">
                          <h2 className="post-title">{post.titulo}</h2>
                          <div className="post-meta">
                            <span className="post-date">
                              <span className="date-icon">🕒</span>
                              {new Date(post.createdAt).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="post-body">
                          <p className="post-content">{post.contenido}</p>
                        </div>
                        <div className="post-footer">
                          <div className="post-tags">
                            <span className="post-tag">Blog</span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state theme-transition">
                    <div className="empty-illustration">
                      <span className="empty-icon">📭</span>
                    </div>
                    <h2 className="empty-title">No hay posts disponibles</h2>
                    <p className="empty-description">Sé el primero en compartir algo interesante con la comunidad.</p>
                    <button 
                      className="empty-action-button" 
                      onClick={() => handleTabChange('create')}
                    >
                      Crear mi primer post
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="create-page">
                <header className="page-header">
                  <h1 className="page-title">Crear Nuevo Post</h1>
                  <p className="page-subtitle">Comparte tus ideas con la comunidad</p>
                </header>
                
                <div className="form-container theme-transition">
                  <form onSubmit={handleSubmit} className="create-form">
                    <div className="form-field">
                      <label htmlFor="titulo" className="field-label">Título</label>
          <input
            type="text"
            id="titulo"
                        name="titulo"
                        className="field-input theme-transition"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
                        placeholder="Escribe un título atractivo"
            required
          />
        </div>
        
                    <div className="form-field">
                      <label htmlFor="contenido" className="field-label">Contenido</label>
          <textarea
            id="contenido"
                        name="contenido"
                        className="field-textarea theme-transition"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
                        placeholder="Comparte tus ideas, experiencias o conocimientos..."
                        rows={isMobile ? 6 : 8}
            required
                      ></textarea>
                    </div>
                    
                    <div className="form-actions">
                      <button
                        type="button"
                        className="cancel-button theme-transition"
                        onClick={() => handleTabChange('posts')}
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit" 
                        className="submit-button"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="button-loader"></span>
                            <span>Publicando...</span>
                          </>
                        ) : (
                          <>
                            <span className="button-icon">✏️</span>
                            <span>Publicar Post</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Botón volver arriba */}
        <button 
          className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
          onClick={scrollToTop}
          aria-label="Volver arriba"
        >
          <span>↑</span>
        </button>
      </main>
    </div>
  )
}

export default App
