/**
 * Footer da aplicação
 * Exibe informações de copyright e aviso sobre armazenamento local
 */

import React from "react";
import { motion } from "framer-motion";

const Footer: React.FC = () => {
  return (
    <motion.footer
      className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="flex flex-col items-center justify-center gap-2 px-6 py-4 text-center">
        <p className="text-sm text-muted-foreground">
          © 2026 To-Do -{" "}
          <span>Todos os direitos reservados - Desenvolvido por </span>
          <a
            href="https://lucas.ferreiradev.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-foreground hover:text-primary transition-colors underline"
          >
            Lucas Ferreira
          </a>
        </p>
        <p className="text-xs text-muted-foreground">
          Todos os dados são salvos localmente no seu navegador
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;
