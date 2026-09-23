import { Link } from "react-router-dom";

type BrandProps = {
  to?: string;
};

function Brand({ to = "/" }: BrandProps) {
  return (
    <Link className="brand" to={to}>
      <span className="brand-mark" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span>NotebookLM</span>
    </Link>
  );
}

export default Brand;
