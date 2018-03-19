#ifndef __FF_CUSTOMALLOCATOR_H__
#define __FF_CUSTOMALLOCATOR_H__

#include "Converters.h"
#include "Size.h"
#include "coreUtils.h"
#include "matUtils.h"
#include "Vec.h"
#include "Point2.h"
#include "Rect.h"
#include "RotatedRect.h"
#include "Workers.h"
#include "CustomAllocator.h"


class CustomMatAllocator : public cv::MatAllocator
{
public:
    // strange evilness of the functions being tagged const means that the fns cant change
    // stuff in the class instance.
    // so instead create constant pointer to a structure which we are allowed to change, even 
    // from a const function.
    typedef struct tag_Variables {
        cv::Mutex MemTotalChangeMutex;
        __int64 TotalMem; // total mem allocated by this allocator
        __int64 CountMemAllocs;
        __int64 CountMemDeAllocs;
        __int64 TotalJSMem; // total mem told to JS so far

        // the main JS thread
        uv_thread_t main_thread;
    } VARIABLES;

    CustomMatAllocator( ) { 
        stdAllocator = cv::Mat::getStdAllocator(); 
        variables = new VARIABLES;
        variables->TotalMem = 0; // total mem allocated by this allocator
        variables->CountMemAllocs = 0;
        variables->CountMemDeAllocs = 0;
        variables->TotalJSMem = 0; // total mem told to JS so far
        
        variables->main_thread = uv_thread_self(); // get the main thread at create
    }
    ~CustomMatAllocator( ) { 
        delete variables;
    }

    cv::UMatData* allocate(int dims, const int* sizes, int type,
                       void* data0, size_t* step, int /*flags*/, cv::UMatUsageFlags /*usageFlags*/) const;
    bool allocate(cv::UMatData* u, int /*accessFlags*/, cv::UMatUsageFlags /*usageFlags*/) const;
    void deallocate(cv::UMatData* u) const;

    __int64 readtotalmem();
    __int64 readmeminformed();
    __int64 readnumallocated();
    __int64 readnumdeallocated();

    // function which adjusts NAN mem to match allocated mem.
    // WILL ONLY ACTUALLY DO ANYTHING FROM MAIN JS LOOP
    void FixupJSMem() const;
    

    VARIABLES *variables;
    
    const cv::MatAllocator* stdAllocator;
};

#endif