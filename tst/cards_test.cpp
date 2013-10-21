#include "cards.h"
#include "gtest/gtest.h"


using namespace std;
//using namespace Game;

namespace {
    class CardsTest : public ::testing::Test {
    protected:
        CardsTest(){

        }
        virtual ~CardsTest(){

        }
       
        virtual void SetUp(){
        }

        virtual void TearDown(){
        }
    };

    TEST_F(CardsTest, isValidCards){
        Cards c;
        EXPECT_EQ(false, c.isValidShowOut());
        c.appendCard(H(2));
        EXPECT_EQ(true, c.isValidShowOut());
    }

    TEST_F(CardsTest, isValidPairCards){
        Cards c;
        c.appendCard(H(2));
        c.appendCard(H(2));
        EXPECT_EQ(true, c.isValidShowOut());
    };

    TEST_F(CardsTest, isValidPairCardsInDifferentColor){
        Cards c;
        c.appendCard(H(2));
        c.appendCard(S(2));
        EXPECT_EQ(true, c.isValidShowOut());
    };


    TEST_F(CardsTest, isInValidPairCards){
        Cards c;
        c.appendCard(H(2));
        c.appendCard(H(3));
        EXPECT_EQ(false, c.isValidShowOut());
    }

    TEST_F(CardsTest, isValidTrigle){
        Cards c;
        c.appendCard(H(2));
        c.appendCard(H(2));
        c.appendCard(H(2));
        EXPECT_EQ(true, c.isValidShowOut());
    }

}//namespace


int main(int argc, char **argv)
{
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
