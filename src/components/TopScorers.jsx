import { CheckCircle, Crown, Trophy } from 'lucide-react';

export default function TopScorers() {
  const scorers = [
    { rank: 1, player: 'QuizWhiz', opponent: 'MindGames', score: 1, color: '#10b981' },
    { rank: 2, player: 'Sajjad', opponent: 'Brainiac', score: 8, color: '#ef4444' }
    
  ];

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown size={20} className="text-warning" />;
    if (rank === 2) return <Trophy size={18} className="text-secondary" />;
    return <span className="text-muted fw-bold">{rank}</span>;
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center mb-4">
        <Trophy size={24} className="text-warning me-2" />
        <h4 className="fw-semibold mb-0 text-dark">Top Scorers</h4>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {/* Header */}
          <div className="row g-0 px-4 py-3 bg-light border-bottom">
            <div className="col-1">
              <small className="text-uppercase text-muted fw-semibold">Rank</small>
            </div>
            <div className="col-6">
              <small className="text-uppercase text-muted fw-semibold">Player</small>
            </div>
            <div className="col-5 text-end">
              <small className="text-uppercase text-muted fw-semibold">Score</small>
            </div>
          </div>

          {/* Scorer List */}
          {scorers.map((scorer) => (
            <div key={scorer.rank} className="row g-0 align-items-center px-4 py-3 border-bottom border-light">
              <div className="col-1">
                <div className="d-flex align-items-center">
                  {getRankIcon(scorer.rank)}
                </div>
              </div>
              <div className="col-6">
                <div className="d-flex align-items-center">
                  <div
                    className="rounded-circle me-3"
                    style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: scorer.color,
                      minWidth: '32px'
                    }}
                  ></div>
                  <div>
                    <div className="fw-semibold text-dark">{scorer.player}</div>
                    <small className="text-muted">vs {scorer.opponent}</small>
                  </div>
                </div>
              </div>
              <div className="col-5 text-end">
                <span className="h5 mb-0 fw-bold text-dark">{scorer.score}</span>
                <CheckCircle size={18} className="text-success ms-2" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View All Link */}
      <div className="text-center mt-3">
        <a href="#" className="text-decoration-none text-primary small fw-semibold">
          View All Scorers →
        </a>
      </div>
    </div>
  );
}