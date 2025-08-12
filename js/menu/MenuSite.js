function initMenu() {
  // Remove a classe 'active' de todos os links
  const menuLinks = document.querySelectorAll('.menu a');
  menuLinks.forEach(link => link.classList.remove('active'));
  
  // Obtém o caminho atual da URL
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  
  // Encontra o link correspondente à página atual
  const currentLink = Array.from(menuLinks).find(link => {
    const linkPath = link.getAttribute('href').split('/').pop();
    return linkPath === currentPath;
  });
  
  // Adiciona a classe 'active' ao link correspondente
  if (currentLink) {
    currentLink.classList.add('active');
  }
  
  // Adiciona efeito de clique
  menuLinks.forEach(link => {
    link.addEventListener('click', function() {
      menuLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      sessionStorage.setItem('activeLink', this.getAttribute('href'));
    });
  });
  
  // Verifica se há um link ativo armazenado
  const storedActiveLink = sessionStorage.getItem('activeLink');
  if (storedActiveLink) {
    const storedLink = Array.from(menuLinks).find(link => 
      link.getAttribute('href') === storedActiveLink
    );
    if (storedLink) {
      menuLinks.forEach(link => link.classList.remove('active'));
      storedLink.classList.add('active');
    }
  }
}

document.addEventListener('DOMContentLoaded', initMenu);