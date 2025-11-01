// En /components/layout/Footer.tsx
export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full bg-saprix-black-blue border-t border-saprix-indigo mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-sm text-saprix-indigo">
          &copy; {currentYear} Saprix.com.co. Todos los derechos reservados.
          <br />
          Desarrollado Nivel Dios por Proyectos iAnGo S.A.S..
        </div>
      </div>
    </footer>
  );
}