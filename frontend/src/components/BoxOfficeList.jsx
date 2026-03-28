export default function BoxOfficeList({ items }) {
  const maxGross = Math.max(...items.map(i => i.gross));

  return (
    <div className="boxoffice-list">
      {items.map((item, index) => {
        const width = (item.gross / maxGross) * 100;

        return (
          <div key={item.title} className="boxoffice-row">
            <div className="rank">#{index + 1}</div>

            <div className="title">{item.title}</div>

            <div className="bar-wrap">
              <div
                className="bar"
                style={{ width: `${width}%` }}
              />
            </div>

            <div className="gross">
              ${item.gross.toLocaleString()}
            </div>
          </div>
        );
      })}
    </div>
  );
}
