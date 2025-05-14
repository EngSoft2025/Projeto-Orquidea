
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-auto py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Projeto Orquídea</h3>
            <p className="text-sm">
              Facilitando o acompanhamento de informações acadêmicas através do ORCID.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm hover:text-primary">Início</Link></li>
              <li><Link to="/search" className="text-sm hover:text-primary">Buscar</Link></li>
              <li><Link to="/monitor" className="text-sm hover:text-primary">Monitoramento</Link></li>
              <li><Link to="/visualizations" className="text-sm hover:text-primary">Visualizações</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Recursos</h3>
            <ul className="space-y-2">
              <li><a href="https://orcid.org" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary">ORCID</a></li>
              <li><a href="#" className="text-sm hover:text-primary">Documentação</a></li>
              <li><a href="#" className="text-sm hover:text-primary">Suporte</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border/50 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Projeto Orquídea. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
