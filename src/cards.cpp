#include "cards.h"

#include <stdlib.h>

void Cards::appendCard(Card card)
{
    m_cards.push_back(card);
}

bool Cards::isValidShowOut()
{
    int count = 0;
    count = m_cards.size();
    if (count == 1){
        return true;
    }

    if (count == 2 && isPair()){
        return true;
    }

    if (count == 3) {
        if (isTrigle()){
            return true;
        }
    }
    
    return false;
}

bool Cards::isSameCardNum(Card a, Card b) 
{
    return abs(a - b) % 13 == 0;
}

bool Cards::isPair()
{
    if (m_cards.size() != 2) {
        return false;
    }

    return isSameCardNum(m_cards[0], m_cards[1]);
}


bool Cards::isTrigle() {
    if (m_cards.size() != 3) {
        return false;
    }
    return isSameCardNum(m_cards[0], m_cards[1]) 
        && isSameCardNum(m_cards[0], m_cards[2]);
}
