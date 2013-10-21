
#include <vector>

typedef char Card;

#define JACK  11
#define QUEEN 12
#define KING  13
#define ACE   14
#define DEE   15

#define COLOR_SEPARATOR 13

#define BASE '!'
#define HEART_BASE (BASE + 0)
#define HEART(n) ((Card)(HEART_BASE + (n)))
#define DIAMOND_BASE (BASE + COLOR_SEPARATOR * 1)
#define DIAMOND(n) ((Card)(DIAMOND_BASE + (n)))
#define CLUB_BASE (BASE + COLOR_SEPARATOR * 2)
#define CLUB(n) ((Card)(CLUB_BASE + (n)))
#define SPADE_BASE (BASE + COLOR_SEPARATOR * 3)
#define SPADE(n) ((Card)(SPADE_BASE + (n)))

#define BLACK_JOKER (BASE + COLOR_SEPARATOR * 4)
#define RED_JOKER   (BASE + COLOR_SEPARATOR * 4 + 1)

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
        bool isBomb();
        bool isSameCardNum(Card a, Card b);
        std::vector<Card> m_cards;
    };
//}

