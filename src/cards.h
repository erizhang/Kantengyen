
#include <vector>

typedef char Card;

#define JACK  11
#define QUEEN 12
#define KING  13
#define ACE   14
#define DEE   15

#define BASE '!'
#define HEART_BASE (BASE + 0)
#define HEART(n) ((Card)(HEART_BASE + (n)))
#define DIAMOND_BASE (BASE + 13)
#define DIMAOND(n) ((Card)(DIAMOND_BASE + (n)))
#define CLUB_BASE (BASE + 26)
#define CLUB(n) ((Card)(CLUB_BASE + (n)))
#define SPADE_BASE (BASE + 39)
#define SPADE(n) ((Card)(SPADE_BASE + (n)))

#define BLACK_JOKER (BASE + 52)
#define RED_JOKER   (BASE + 53)

#define H HEART
#define D DIAMOND
#define C CLUB
#define S SPADE

//namespace Game {
    class Cards{
    public:
        Cards(){}
        ~Cards(){m_cards.empty();}
        void appendCard(Card card);
        bool isValidShowOut();
    private:
        bool isPair();
        bool isTrigle();
        std::vector<Card> m_cards;
    };
//}

