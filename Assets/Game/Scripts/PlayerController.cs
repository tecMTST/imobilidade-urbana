using UnityEngine;

public class PlayerController : MonoBehaviour
{
    public float moveSpeed = 5f;
    public CameraController cameraController;
    
    private bool isMovingRight = false;
    private bool isMovingLeft = false;

    private void Update()
    {
        if (isMovingRight)
        {
            Vector3 newPosition = transform.position + Vector3.right * moveSpeed * Time.deltaTime;
            transform.position = newPosition;
            transform.rotation = Quaternion.identity;
        }
        else if (isMovingLeft) 
        {
            Vector3 newPosition = transform.position + Vector3.left * moveSpeed * Time.deltaTime;
            transform.position = newPosition;
            transform.rotation = Quaternion.Euler(0f, 180f, 0f);
        }
    }

    private void OnTriggerEnter2D(Collider2D other)
    {
        if (other.gameObject.name == "metro")
        {
            int roomIndex = other.GetComponent<RoomTrigger>().roomIndex;
            cameraController.SwitchRoom(roomIndex);
        }
    }

    public void StartMovingRight()
    {
        isMovingRight = true;
        isMovingLeft = false;
    }

    public void StopMovingRight()
    {
        isMovingRight = false;
    }

    public void StartMovingLeft()
    {
        isMovingLeft = true;
        isMovingRight = false;
    }

    public void StopMovingLeft()
    {
        isMovingLeft = false;
    }
}
