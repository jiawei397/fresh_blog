interface Props {
  title: string;
  description: string;
}

const Nav = ({ title, description }: Props) => {
  return (
    <div class="nav">
      <div class="ui grid">
        <div class="four wide column"></div>

        <div class="eight wide column">
          <a href="/posts">
            <h1>{title}</h1>
          </a>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default Nav;
